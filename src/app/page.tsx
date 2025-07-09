"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import { Inter, Caveat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InternshipCards from "@/lib/components/InternshipCards";
import { sampleInternshipData } from "@/lib/test/sample";

// Bookmark functionality
import { toggleBookmarkInFirestore } from "@/lib/modules/toggleBookmark";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ['600', '700'],
  variable: "--font-caveat",
});

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserData(data);

          const saved: string[] = data.savedInternships || [];
          const map: { [key: string]: boolean } = {};
          saved.forEach((id: string) => {
            map[id] = true;
          });
          setBookmarked(map);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleBookmark = async (internshipId: string) => {
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

  if (isLoading) return null;

  if (user) {
    // Prepare filtered saved internships once
    const savedInternshipsFiltered = sampleInternshipData.filter((internship) =>
      userData?.savedInternships?.includes(internship.id)
    );

    return (
      <div className="overflow-hidden">
        {/* Top Section */}
        <div className="bg-[#9381FF] text-white">
          <div className="px-6 md:px-20 pt-28 pb-28 relative text-right">
            <div className="inline-block max-w-full">
              <h1 className="text-[52px] font-bold">
                Beware, {userData?.displayName?.split(" ")[0] || user.displayName || "Intern"}
              </h1>
              <p
                className={`text-left text-[60px] leading-[115%] tracking-[-0.05em] ${caveat.className}`}
              >
                An internship deadline is near
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section - View and Manage Internships */}
        <div
          className="
            relative
            bg-white/30 
            backdrop-blur-md
            rounded-tl-[25px] rounded-bl-[25px]
            mt-6 mx-4
            text-[#2F2F3A]
            flex flex-col
            max-w-full
            shadow-lg
          "
        >
          {/* Header Section: Title + Button */}
          <div className="flex items-center justify-between px-6 md:px-20 pt-18 pb-12">
            <div className="flex flex-col items-start">
              <p className="text-[18px] text-[#A2A2C7] tracking-[-0.04em] mb-1">
                Track your internships
              </p>
              <h2 className="text-5xl font-semibold">Your Internships</h2>
            </div>

            <Link
              href="/pages/internships"
              className="
                inline-flex items-center
                px-6 py-3
                text-[18px] font-light
                text-white bg-[#E26262]
                rounded-full gap-3.5
                hover:bg-[#d65050]
                transition-colors duration-200
                cursor-pointer
                shadow-lg
                whitespace-nowrap
              "
            >
              see all <ArrowForwardIcon className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Internship Cards Container with horizontal scrollbar */}
          <div
            className="
              flex space-x-6
              overflow-x-auto
              scrollbar-thin scrollbar-thumb-[#E26262]/80 scrollbar-track-[#F3F3F3]
              scrollbar-thumb-rounded-full scrollbar-track-rounded-full
              px-6 md:px-20 pb-8
              snap-x snap-mandatory
              max-w-full
            "
          >
            {/* Render InternshipCards component ONCE with the filtered internships */}
            <InternshipCards
              internships={savedInternshipsFiltered}
              bookmarked={bookmarked}
              toggleBookmark={toggleBookmark}
            />
          </div>
        </div>
      </div>
    );
  }

  // Landing page if not logged in
  return (
    <div className="text-[#1d1d1f] px-6 md:px-20 pt-24 pb-32 relative overflow-hidden">
      {/* ... Your landing page JSX unchanged ... */}
      {/* (omitted here for brevity, keep your existing landing page code) */}
    </div>
  );
}
