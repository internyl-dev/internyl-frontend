"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import SearchBar from "@/lib/components/SearchBar";
import InternshipCards from "@/lib/components/InternshipCards";
import { toggleBookmarkInFirestore } from "@/lib/modules/toggleBookmark";
import { InternshipCards as InternshipType } from "@/lib/types/internshipCards";

// Firebase
import { auth, db } from "@/lib/config/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const filterData = [
  {
    label: "Due in",
    color: "bg-[#f7d7db]",
    options: ["Past Due", "Due Today", "Due This Week", "Due This Month"],
  },
  {
    label: "Subject",
    color: "bg-[#e4e8f6]",
    options: ["Engineering", "Math", "Computer Science", "Art", "Business"],
  },
  {
    label: "Cost",
    color: "bg-[#f4e3f2]",
    options: ["Free", "Under $1000", "$1000–$3000", "$3000+"],
  },
  {
    label: "Eligibility",
    color: "bg-[#f9e4cb]",
    options: ["Rising Sophomores", "Juniors", "Seniors", "College Students"],
  },
  {
    label: "Duration",
    color: "bg-[#def0ea]",
    options: ["1 week", "2–4 weeks", "1–2 months", "Full Summer"],
  },
];

function getDueCategory(date: Date | null): string {
  if (!date) return "not provided";
  const today = new Date();
  const input = new Date(date);
  input.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((input.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return "Past Due";
  if (daysDiff === 0) return "Due Today";

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  if (input <= endOfWeek) return "Due This Week";
  if (input <= endOfMonth) return "Due This Month";

  return "Later";
}

export default function Internships() {
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [internships, setInternships] = useState<InternshipType[]>([]);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);


  const router = useRouter();

  useEffect(() => {
    async function fetchInternships() {
      try {
        const internshipsCollection = collection(db, "internships");
        const snapshot = await getDocs(internshipsCollection);
        const fetchedInternships = snapshot.docs.map((doc) => {
          const data = doc.data();
          const deadlines = data.deadlines?.map((deadline: any) => ({
            ...deadline,
            date: deadline.date?.toDate ? deadline.date.toDate() : deadline.date,
          })) || [];

          return {
            id: doc.id,
            ...data,
            deadlines,
          } as InternshipType;
        });
        setInternships(fetchedInternships);
      } catch (error) {
        console.error("Error fetching internships:", error);
      }
    }

    fetchInternships();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const saved: string[] = data.savedInternships || [];
          const map: { [key: string]: boolean } = {};
          saved.forEach((id: string) => {
            map[id] = true;
          });
          setBookmarked(map);
        }

        // Check for pending bookmark from localStorage
        const pendingId = localStorage.getItem("pendingBookmark");
        if (pendingId) {
          await toggleBookmarkInFirestore(pendingId, false);
          setBookmarked((prev) => ({ ...prev, [pendingId]: true }));
          localStorage.removeItem("pendingBookmark");
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleBookmark = async (internshipId: string) => {
    if (!user) {
      localStorage.setItem("pendingBookmark", internshipId);
      router.push("/pages/signup");
      return;
    }

    const isBookmarked = bookmarked[internshipId] === true;

    try {
      await toggleBookmarkInFirestore(internshipId, isBookmarked);
      setBookmarked((prev) => ({
        ...prev,
        [internshipId]: !isBookmarked,
      }));
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const toggleFilterOption = (category: string, option: string) => {
    setActiveFilters((prev) => {
      const selected = new Set(prev[category] || []);
      if (selected.has(option)) {
        selected.delete(option);
      } else {
        selected.add(option);
      }
      return {
        ...prev,
        [category]: Array.from(selected),
      };
    });
  };

  const filterInternships = () => {
    return internships.filter((internship) => {
      const searchableText = `${internship.title} ${internship.provider} ${internship.subject}`.toLowerCase();
      if (searchTerm && !searchableText.includes(searchTerm.toLowerCase())) {
        return false;
      }

      return Object.entries(activeFilters).every(([category, selectedOptions]) => {
        if (selectedOptions.length === 0) return true;

        switch (category) {
          case "Due in":
            const deadline = internship.deadlines[0]?.date ?? null;
            const dueCategory = getDueCategory(deadline);
            return selectedOptions.includes(dueCategory);

          case "Subject":
            return selectedOptions.includes(internship.subject);

          case "Cost": {
            const raw = internship.cost;
            if (raw === "not provided") return false;

            let costNum: number;
            if (raw === "free") {
              costNum = 0;
            } else if (typeof raw === "number") {
              costNum = raw;
            } else if (typeof raw === "string") {
              const numericStr = raw.replace(/[^0-9]/g, "");
              if (!numericStr) return false;
              costNum = parseInt(numericStr);
            } else {
              return false;
            }

            return selectedOptions.some((opt) => {
              if (opt === "Free") return costNum === 0;
              if (opt === "Under $1000") return costNum > 0 && costNum < 1000;
              if (opt === "$1000–$3000") return costNum >= 1000 && costNum <= 3000;
              if (opt === "$3000+") return costNum > 3000;
              return false;
            });
          }

          case "Eligibility": {
            type GradeLabel = "Rising Sophomores" | "Juniors" | "Seniors" | "College Students";
            type Grade = "sophomore" | "junior" | "senior" | "undergraduate";

            const gradeMap: Record<GradeLabel, Grade> = {
              "Rising Sophomores": "sophomore",
              Juniors: "junior",
              Seniors: "senior",
              "College Students": "undergraduate",
            };

            return selectedOptions.some((opt) =>
              internship.eligibility.grades.includes(gradeMap[opt as GradeLabel])
            );
          }

          case "Duration":
            if (internship.duration_weeks === null) return false;
            const w = internship.duration_weeks;
            return selectedOptions.some((opt) => {
              if (opt === "1 week") return w <= 1;
              if (opt === "2-4 weeks") return w > 1 && w <= 4;
              if (opt === "1–2 months") return w > 4 && w <= 8;
              if (opt === "Full Summer") return w > 8;
              return false;
            });

          default:
            return true;
        }
      });
    });
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen radial-bg text-gray-800 px-4">
      <SearchBar setSearch={setSearchTerm} initialValue={initialSearch} />

      <div className="flex flex-wrap justify-center gap-4 mt-6 relative z-10">
        {filterData.map((filter) => (
          <div key={filter.label} className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === filter.label ? null : filter.label))
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${filter.color} text-black text-sm font-semibold shadow-sm hover:brightness-95 transition`}
            >
              <span>{filter.label}</span>
              <ChevronDown className="w-4 h-4 mt-[1px]" />
            </button>

            {openDropdown === filter.label && (
              <div className="absolute top-12 left-0 w-48 bg-white rounded-xl shadow-lg p-3 space-y-2 z-20">
                {filter.options.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-gray-700 ">
                    <input
                      type="checkbox"
                      checked={activeFilters[filter.label]?.includes(option) || false}
                      onChange={() => toggleFilterOption(filter.label, option)}
                      className="accent-black"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <InternshipCards
        internships={filterInternships()}
        bookmarked={bookmarked}
        toggleBookmark={toggleBookmark}
      />
    </div>
  );
}
