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
                Beware, {userData?.displayName?.split(" ")[0] || user.displayName?.split(" ")[0] || "Intern"}
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
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto relative z-10 mr-auto ml-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="text-center lg:text-left max-w-2xl">
            <p className="text-sm text-[#8d8dac] font-medium mb-2">
              Internyl — Internship Tracker for Students
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className={`text-[#ec6464] font-extrabold ${inter.className}`}>Streamline</span> your search,<br />
              Secure <span className={`italic font-extrabold ${caveat.className} text-7xl`}>your</span> <span className={`italic font-extrabold ${caveat.className} text-7xl`}>future</span>
            </h1>
            <p className="mt-4 text-lg text-[#1d1d1f]">
              Internyl helps students find and track internships and programs — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="search for your dream internship"
                className="px-6 py-3 rounded-full text-base w-full max-w-md shadow-sm border border-gray-300"
              />
              <button className="bg-[#ec6464] text-white px-6 py-3 rounded-full font-semibold">
                begin search →
              </button>
            </div>
            <p className="text-sm italic mt-2 text-[#1d1d1f]">it&apos;s free</p>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex justify-end w-full">
            <Image
              src="/internyl-infinite-cards.svg"
              alt="Internship tiles visual"
              className="w-[440px] xl:w-[1000px] drop-shadow-2xl"
              width={440}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="mt-32 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Skip the search, <br className="sm:hidden" />just choose and apply</h2>
        <p className="text-base text-[#1d1d1f] mb-10">
          Internyl simplifies the entire search, so you can focus on applying.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-start gap-6 max-w-5xl mx-auto">
          <div className="bg-white border border-gray-300 rounded-xl p-6 text-left w-full md:w-1/2 shadow">
            <h3 className="font-semibold mb-3">Finding an internship without Internyl:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li><s>Google random keywords</s></li>
              <li><s>Open 10+ tabs</s></li>
              <li><s>Search each website for eligibility</s></li>
              <li><s>Manually copy deadlines</s></li>
              <li><s>Track due dates on a random Google Doc</s></li>
              <li><s>Forget which ones you applied to</s></li>
              <li><s>Miss the results email</s></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-6 text-left w-full md:w-1/2 shadow">
            <h3 className="font-semibold mb-3">Finding an internship with Internyl:</h3>
            <ul className="text-sm text-[#1d1d1f] space-y-1 list-disc list-inside">
              <li>
                Use <span className="text-[#3C66C2] font-medium">smart filters</span> to explore curated internships & programs
              </li>
              <li>
                View all <span className="text-[#E66646] font-medium">key info</span> at a glance: deadlines, eligibility, cost
              </li>
              <li>
                <span className="text-[#2BA280] font-medium">Save listings</span>, set reminders, and <span className="text-[#E66646] font-medium">never miss a deadline</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-32 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">No more stress,<br />we&apos;ve got you</h2>
        <p className="text-base mb-3">
          Discover programs easily with our intuitive search features.
        </p>
        <p className="text-base mb-3">
          Save programs and receive reminders so that you never miss a deadline.
        </p>
        <p className="text-base mb-8">
          Gain access to exclusive information like acceptance rates and release dates not even the program website will tell you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow text-center">
            <p className="text-sm font-medium">
              Discover programs easily with our intuitive search features.
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow text-center">
            <p className="text-sm font-medium">
              Save programs and receive reminders so that you never miss a deadline.
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow text-center">
            <p className="text-sm font-medium">
              Gain access to exclusive information like acceptance rates and release dates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
