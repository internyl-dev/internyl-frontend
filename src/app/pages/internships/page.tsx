"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, Filter, Search } from "lucide-react";
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown') && !target.closest('.filter-button')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
  };

  const getFilterColor = (category: string) => {
    return filterData.find(f => f.label === category)?.color || "bg-gray-200";
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
            type Grade = "sophomore" | "junior" | "senior" | "undergraduate";
            const gradeMap: { [key: string]: Grade } = {
              "Rising Sophomores": "sophomore",
              "Juniors": "junior",
              "Seniors": "senior",
              "College Students": "undergraduate",
            };

            return selectedOptions.some((opt) => {
              const mappedGrade = gradeMap[opt];
              return mappedGrade && internship.eligibility.grades.includes(mappedGrade);
            });
          }

          case "Duration":
            if (internship.duration_weeks === null) return false;
            const w = internship.duration_weeks;
            return selectedOptions.some((opt) => {
              if (opt === "1 week") return w <= 1;
              if (opt === "2–4 weeks") return w > 1 && w <= 4;
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

  const filteredInternships = filterInternships();
  const totalActiveFilters = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen radial-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen radial-bg text-gray-800 px-4">
      <SearchBar setSearch={setSearchTerm} initialValue={initialSearch} />

      {/* Active Filters Display */}
      {(totalActiveFilters > 0 || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 mb-4 mt-8 justify-center">
          {searchTerm && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm">
              <Search className="w-3 h-3" />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => setSearchTerm("")}
                className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {Object.entries(activeFilters).map(([category, options]) =>
            options.map((option) => (
              <div
                key={`${category}-${option}`}
                className={`flex items-center gap-1 px-3 py-1 ${getFilterColor(category)} rounded-full text-sm text-black`}
              >
                <span>{category}: {option}</span>
                <button
                  onClick={() => toggleFilterOption(category, option)}
                  className="hover:brightness-90 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
          {(totalActiveFilters > 0 || searchTerm) && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-center mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          Filters
          {totalActiveFilters > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalActiveFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className={`${showMobileFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-wrap justify-center gap-4 mt-6 relative z-10">
          {filterData.map((filter) => {
            const hasActiveOptions = activeFilters[filter.label]?.length > 0;
            return (
              <div key={filter.label} className="relative filter-dropdown">
                <button
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === filter.label ? null : filter.label))
                  }
                  className={`filter-button flex items-center gap-2 px-4 py-2 rounded-full ${filter.color} text-black text-sm font-semibold shadow-sm hover:brightness-95 transition ${
                    hasActiveOptions ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <span>{filter.label}</span>
                  {hasActiveOptions && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilters[filter.label].length}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 mt-[1px] transition-transform ${
                    openDropdown === filter.label ? 'rotate-180' : ''
                  }`} />
                </button>

                {openDropdown === filter.label && (
                  <div className="absolute top-12 left-0 w-48 bg-white rounded-xl shadow-lg p-3 space-y-2 z-20 border">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b">
                      <span className="text-sm font-medium text-gray-700">{filter.label}</span>
                      {hasActiveOptions && (
                        <button
                          onClick={() => setActiveFilters(prev => {
                            const newFilters = { ...prev };
                            delete newFilters[filter.label];
                            return newFilters;
                          })}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {filter.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 p-1 rounded transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.label]?.includes(option) || false}
                          onChange={() => toggleFilterOption(filter.label, option)}
                          className="accent-blue-500"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* No Results Message */}
      {filteredInternships.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No internships found</div>
          <p className="text-gray-400 text-sm mb-4">
            Try adjusting your search terms or filters
          </p>
          {(totalActiveFilters > 0 || searchTerm) && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <InternshipCards
        internships={filteredInternships}
        bookmarked={bookmarked}
        toggleBookmark={toggleBookmark}
      />
    </div>
  );
}