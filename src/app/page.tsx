"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/config/firebaseConfig";
import { doc, getDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { motion, useInView } from "framer-motion";

import { Inter, Caveat, Kalam } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import InternshipCards from "@/lib/components/InternshipCards";
import Brushstroke from "@/lib/components/Brushstroke";
import { toggleBookmarkInFirestore } from "@/lib/modules/toggleBookmark";
import { InternshipCards as Internship } from "@/lib/types/internshipCards";
import { useInternshipsWithFallback } from "@/lib/hooks/useRecommendedInternships";

// Define user data type
interface UserData {
  displayName?: string;
  savedInternships?: string[];
}

// Define deadline type
interface Deadline {
  date: Date | null;
  [key: string]: unknown;
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ['600', '700'],
  variable: "--font-caveat",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-kalam",
});

// Animated Strikethrough List Component with enhanced animations
const AnimatedStrikethroughList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const items = [
    "Google random keywords",
    "Open 10+ tabs",
    "Search each website for eligibility",
    "Manually copy deadlines",
    "Track due dates on a random Google Doc",
    "Forget which ones you applied to",
    "Miss the results email"
  ];

  return (
    <ul
      ref={ref}
      className="text-gray-800 space-y-3 list-disc list-inside text-base md:text-lg font-medium"
      style={{ textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)' }}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          className="relative transform transition-all duration-300 hover:scale-[1.02]"
          initial={{ opacity: 0.4, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.4, x: -20 }}
          transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
        >
          <span className="relative">
            {item}
            <motion.span
              className="absolute inset-0 border-t-2 border-gray-600"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                transformOrigin: 'left center'
              }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.25,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          </span>
        </motion.li>
      ))}
    </ul>
  );
};

// Enhanced Floating Card Animation Component
const FloatingCard = ({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, rotate: 0 }}
      animate={{
        y: [-5, 5, -5],
        rotate: [-0.5, 0.5, -0.5]
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

const InsightsWidget = ({ savedCount, totalInternships, savedInternshipsFiltered }: {
  savedCount: number;
  totalInternships: number;
  savedInternshipsFiltered: Internship[];
}) => {
  const completionRate = totalInternships > 0 ? (savedCount / totalInternships) * 100 : 0;
  const activeCount = savedInternshipsFiltered.filter(i => {
    const deadlines = i.dates?.deadlines || [];
    const nextDeadline = deadlines.find(d => d.date && new Date(d.date) > new Date());
    return nextDeadline;
  }).length;
  const dueSoonCount = savedInternshipsFiltered.filter(i => {
    const deadlines = i.dates?.deadlines || [];
    const soonDeadline = deadlines.find(d => {
      if (!d.date) return false;
      const deadlineDate = new Date(d.date);
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return deadlineDate <= weekFromNow && deadlineDate > new Date();
    });
    return soonDeadline;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mx-2 sm:mx-4 mt-6"
    >
      <h3 className="text-lg font-semibold text-[#2F2F3A] mb-4">Your Progress</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(savedCount / Math.max(totalInternships, 1) * 100, 100)}%` }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ec6464] to-[#f07575]"
          />
          <motion.div
            className="text-2xl font-bold text-[#ec6464]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          >
            {savedCount}
          </motion.div>
          <div className="text-sm text-gray-600">Saved</div>
        </motion.div>
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#9381FF] to-[#A891FF]"
          />
          <motion.div
            className="text-2xl font-bold text-[#9381FF]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          >
            {Math.round(completionRate)}%
          </motion.div>
          <div className="text-sm text-gray-600">Explored</div>
        </motion.div>
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(activeCount / Math.max(savedCount, 1) * 100, 100)}%` }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#2BA280] to-[#3C66C2]"
          />
          <motion.div
            className="text-2xl font-bold text-[#2BA280]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
          >
            {activeCount}
          </motion.div>
          <div className="text-sm text-gray-600">Active</div>
        </motion.div>
        <motion.div
          className="p-3 bg-white/40 rounded-xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: dueSoonCount > 0 ? "100%" : "0%" }}
            transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E26262] to-[#F07575]"
          />
          <motion.div
            className="text-2xl font-bold text-[#E26262]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          >
            {dueSoonCount}
          </motion.div>
          <div className="text-sm text-gray-600">Due Soon</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-[#9381FF] to-[#A891FF] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border border-white/20"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </>
  );
};

// Component that uses useSearchParams - wrapped in its own Suspense
function HomeContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [userData, setUserData] = useState<UserData | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

  const { internshipsToShow } = useInternshipsWithFallback(bookmarked);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      router.push(`/pages/internships?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Helper to safely convert Firestore Timestamp to JS Date
  function toDateIfTimestamp(value: Date | Timestamp | null | undefined): Date | null {
    if (value && typeof (value as Timestamp).toDate === "function") {
      return (value as Timestamp).toDate();
    }
    if (value instanceof Date) {
      return value;
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data() as UserData;
          setUserData(data);

          const saved: string[] = data.savedInternships || [];
          const map: { [key: string]: boolean } = {};
          saved.forEach((id: string) => {
            map[id] = true;
          });
          setBookmarked(map);
        }

        const querySnapshot = await getDocs(collection(db, "programs-display"));
        const internshipList = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          if (Array.isArray(data.deadlines)) {
            data.deadlines = data.deadlines.map((d: Deadline) => ({
              ...d,
              date: toDateIfTimestamp(d.date),
            }));
          }

          return {
            id: doc.id,
            ...data,
          };
        }) as Internship[];

        setInternships(internshipList);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (searchTerm.length >= 2 && internships.length > 0) {
      const suggestions = new Set<string>();

      internships.forEach(internship => {
        const title = internship.overview?.title;
        const provider = internship.overview?.provider;
        const subjects = internship.overview?.subject || [];
        const tags = internship.overview?.tags || [];

        // Add title matches
        if (title && title.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.add(title);
        }

        // Add provider matches
        if (provider && provider.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.add(provider);
        }

        // Add subject matches
        subjects.forEach(subject => {
          if (subject && subject.toLowerCase().includes(searchTerm.toLowerCase())) {
            suggestions.add(subject);
          }
        });

        // Add tag matches
        tags.forEach(tag => {
          if (tag && tag.toLowerCase().includes(searchTerm.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      });

      const suggestionArray = Array.from(suggestions).slice(0, 5);
      setSearchSuggestions(suggestionArray);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, internships]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9381FF] via-[#A891FF] to-[#9381FF]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <motion.p
            className="text-white text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading your internships...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (user) {
    const savedInternshipsFiltered = internships.filter((internship) =>
      userData?.savedInternships?.includes(internship.id)
    );

    return (
      <div className="overflow-hidden">
        <ScrollToTop />
        {/* Top Section with enhanced gradient */}
        <div className="bg-gradient-to-br from-[#9381FF] via-[#A891FF] to-[#9381FF] text-white relative">
          <div className="absolute inset-0 bg-black/5"></div>

          {/* BrushStroke on the left */}
          <motion.div
            className="absolute left-0 top-0 w-13/20 h-full z-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ height: '100%', marginLeft: '-13%' }}
          >
            <div style={{ animationDelay: '0.6s', height: '100%', display: 'flex', alignItems: 'center' }}>
              <Brushstroke
                duration={2}
                paddingScale={2}
                style={{ width: '100%', height: '50%' }}
              >
                ‎‎
              </Brushstroke>
            </div>
          </motion.div>

          {/* Original text positioning */}
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-20 md:pb-28 relative text-center z-10">
            <motion.div
              className="inline-block max-w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Beware, {userData?.displayName?.split(" ")[0] || user.displayName?.split(" ")[0] || "Intern"}
              </motion.h1>
              <motion.p
                className={`text-center text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-[115%] tracking-[-0.05em] ${caveat.className} drop-shadow-md`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                An internship deadline is near
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Smart Data Insights Widget */}
        <InsightsWidget
          savedCount={savedInternshipsFiltered.length}
          totalInternships={internships.length}
          savedInternshipsFiltered={savedInternshipsFiltered}
        />

        {/* Middle Section with enhanced styling */}
        <motion.div
          className="relative bg-white/40 backdrop-blur-xl rounded-tl-[30px] rounded-bl-[30px] rounded-tr-[30px] rounded-br-[30px] mt-6 mx-2 sm:mx-4 text-[#2F2F3A] flex flex-col max-w-full shadow-2xl border border-white/20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-6 md:px-12 lg:px-20 pt-10 md:pt-18 sm:pb-8 md:pb-12 gap-4 md:gap-0 ml-8 sm:ml-0 pb-0">
            <div className="flex flex-col items-start w-full md:w-auto">
              <p className="text-base sm:text-lg md:text-[18px] text-[#A2A2C7] tracking-[-0.04em] mb-1 font-medium">
                Track your internships
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-r from-[#2F2F3A] to-[#5A5A6B] bg-clip-text text-transparent">
                Your Internships
              </h2>
            </div>
            <Link
              href="/pages/internships"
              className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-[18px] font-medium text-white bg-gradient-to-r from-[#E26262] to-[#F07575] rounded-full gap-2 sm:gap-3.5 hover:from-[#d65050] hover:to-[#e66666] transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap mt-4 md:mt-0 border border-white/20"
            >
              see all
              <ArrowForwardIcon className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Scrollable Internship Cards with enhanced container */}
          <div className="overflow-x-auto px-2 sm:px-6 md:px-12 lg:px-20 pb-8 md:pb-10">
            <div className="flex w-max md:w-full gap-6">
              {savedInternshipsFiltered.length === 0 ? (
                <motion.div
                  className="w-full text-center py-12 px-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved internships yet</h3>
                  <p className="text-gray-500 mb-6">Start exploring and bookmark internships you&apos;re interested in!</p>
                  <Link
                    href="/pages/internships"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#E26262] to-[#F07575] text-white rounded-full hover:from-[#d65050] hover:to-[#e66666] transition-all duration-300 font-medium gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Explore Internships
                    <ArrowForwardIcon className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                savedInternshipsFiltered.map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    className="flex-shrink-0 min-w-[280px] max-w-xs md:max-w-sm sm:mr-0 mr-10"
                    initial={{ opacity: 1, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <InternshipCards
                      internships={[internship]}
                      bookmarked={bookmarked}
                      toggleBookmark={toggleBookmark}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Suggested Internships Section */}
        <motion.div
          className="relative bg-white/40 backdrop-blur-xl rounded-tl-[30px] rounded-bl-[30px] rounded-tr-[30px] rounded-br-[30px] mt-10 mx-2 sm:mx-4 text-[#2F2F3A] flex flex-col max-w-full shadow-2xl border border-white/20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-6 md:px-12 lg:px-20 pt-10 md:pt-18 sm:pb-8 md:pb-12 gap-4 md:gap-0 ml-8 pb-0">
            <div className="flex flex-col items-start w-full md:w-auto">
              <p className="text-base sm:text-lg md:text-[18px] text-[#A2A2C7] tracking-[-0.04em] mb-1 font-medium">
                Recommended for you
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-r from-[#2F2F3A] to-[#5A5A6B] bg-clip-text text-transparent">
                Suggested Internships
              </h2>
            </div>
            <Link
              href="/pages/internships?bookmarked=true"
              className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-[18px] font-medium text-white bg-gradient-to-r from-[#E26262] to-[#F07575] rounded-full gap-2 sm:gap-3.5 hover:from-[#d65050] hover:to-[#e66666] transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap mt-4 md:mt-0 border border-white/20"
            >
              see all
              <ArrowForwardIcon className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="overflow-x-auto px-2 sm:px-6 md:px-12 lg:px-20 pb-8 md:pb-10">
            <div className="flex w-max md:w-full gap-6">
              {internshipsToShow.length === 0 ? (
                <div className="w-full text-center py-12 px-6">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No recommendations yet</h3>
                  <p className="text-gray-500 mb-6">We&apos;ll begin suggesting as soon as you begin searching!</p>
                  <Link
                    href="/pages/internships"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#E26262] to-[#F07575] text-white rounded-full hover:from-[#d65050] hover:to-[#e66666] transition-all duration-300 font-medium gap-2"
                  >
                    Explore Internships
                    <ArrowForwardIcon className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                internshipsToShow.map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    className="flex-shrink-0 min-w-[280px] max-w-xs md:max-w-sm sm:mr-0 mr-10"
                    initial={{ opacity: 1, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <InternshipCards
                      internships={[internship]}
                      bookmarked={bookmarked}
                      toggleBookmark={toggleBookmark}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Smart Data Insights Widget
        <InsightsWidget
          savedCount={savedInternshipsFiltered.length}
          totalInternships={internships.length}
          savedInternshipsFiltered={savedInternshipsFiltered}
        /> */}
      </div>
    );
  }

  // Enhanced Public Landing Page
  return (
    <div className="text-[#1d1d1f] px-3 sm:px-6 md:px-12 lg:px-20 pt-16 sm:pt-24 pb-20 sm:pb-32 relative overflow-hidden">
      <ScrollToTop />
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-52 h-52 sm:w-72 sm:h-72 bg-gradient-to-br from-[#ec6464]/10 to-[#9381FF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-[#2BA280]/10 to-[#3C66C2]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Hero Text */}
          <motion.div
            className="text-center lg:text-left w-full mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="text-sm text-[#8d8dac] font-semibold mb-3 tracking-wide uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Internyl — Internship Tracker for Students
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className={`text-transparent bg-gradient-to-r from-[#ec6464] to-[#f07575] bg-clip-text font-extrabold ${inter.className} drop-shadow-sm`}>Streamline</span><br />
              <span>your search,</span><br />
              Secure <span className={`font-bold ${kalam.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-gradient-to-r from-[#9381FF] to-[#A891FF] bg-clip-text`}>your</span><br />
              <span className={`font-bold ${kalam.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-gradient-to-r from-[#2BA280] to-[#3C66C2] bg-clip-text transition-all duration-300`}>future</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-[#1d1d1f]/80 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Internyl helps students find and track internships and programs — all in one place.
            </motion.p>

            {/* Search Form */}
            <motion.div
              className="mt-8 flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <form
                className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-xl px-2"
                onSubmit={handleSearch}
              >
                <div className="relative w-full">
                  <SearchOutlinedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="search for your dream internship..."
                    className="pl-12 pr-6 py-4 rounded-2xl text-base w-full shadow-lg border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#ec6464]/50 focus:border-[#ec6464] transition-all duration-300 hover:shadow-xl font-medium placeholder:text-gray-400"
                    minLength={2}
                    required
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => { setSearchTerm(''); setShowSuggestions(false); }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setSearchTerm(suggestion);
                            setShowSuggestions(false);
                            router.push(`/pages/internships?search=${encodeURIComponent(suggestion)}`);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-[#ec6464]/10 transition-colors duration-200 border-b border-gray-100 last:border-b-0 text-gray-700 font-medium"
                        >
                          <SearchOutlinedIcon className="w-4 h-4 text-gray-400 mr-3 inline" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="group w-full sm:w-auto bg-gradient-to-r from-[#ec6464] to-[#f07575] hover:from-[#d65050] hover:to-[#e66666] text-white px-8 py-4 rounded-2xl font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center whitespace-nowrap text-base min-h-[56px] shadow-xl hover:shadow-2xl transform hover:scale-105 border border-white/20"
                >
                  <span className="inline-flex items-center gap-2">
                    begin search
                    <ArrowForwardIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </form>

              {/* Free to Use Badge */}
              <motion.div
                className="flex justify-center md:justify-end w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src="/free-text.svg"
                  width={200}
                  height={54}
                  alt="Free to use"
                  className="w-auto h-12 sm:h-14 drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(236,100,100,0.15))' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="md:flex justify-center hidden md:justify-end w-full mt-10 md:mt-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <FloatingCard delay={0.5}>
              <Image
                src="/enhanced_filled_cards-cropped.svg"
                alt="Internship tiles visual"
                className="drop-shadow-2xl object-left w-[240px] sm:w-[420px] md:w-[580px] lg:w-[740px] ml-15 h-auto hover:scale-105 transition-transform duration-500 ease-out"
                width={740}
                height={740}
              />
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Comparison Section */}
      <motion.section
        className="mt-30 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#1d1d1f] to-[#4a4a5a] bg-clip-text text-transparent">
          Skip the search, <br className="sm:hidden" />just choose and apply
        </h2>
        <p className="text-base text-[#1d1d1f]/70 mb-12 font-medium">
          Internyl simplifies the entire search, so you can focus on applying.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 sm:gap-8 max-w-6xl mx-auto text-md">
          {/* Without Internyl Card - Enhanced */}
          <motion.div
            className="relative w-full md:w-1/2 p-6 sm:p-8 text-left rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden min-w-[220px] border border-red-100/50 group hover:scale-[1.02] transition-all duration-500"
            style={{
              boxShadow: '0 20px 60px 0 rgba(226, 98, 98, 0.15)',
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(236,100,100,0.08) 50%, rgba(255,255,255,0.2) 100%)',
              zIndex: 0,
            }} />
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900 mb-4 drop-shadow-lg text-lg md:text-xl flex justify-between items-center group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.10)' }}>
                Finding an internship without Internyl
                <ThumbDownOutlinedIcon className="text-[#e02b2b] ml-2 group-hover:rotate-12 transition-transform duration-300" />
              </h3>
              <AnimatedStrikethroughList />
            </div>
          </motion.div>

          {/* With Internyl Card - Enhanced */}
          <motion.div
            className="relative w-full md:w-1/2 p-6 sm:p-8 text-left rounded-3xl shadow-2xl border border-green-100/50 bg-white/20 backdrop-blur-2xl overflow-hidden min-w-[220px] group hover:scale-[1.02] transition-all duration-500"
            style={{
              boxShadow: '0 20px 60px 0 rgba(43, 162, 128, 0.15)',
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(43,162,128,0.08) 50%, rgba(255,255,255,0.2) 100%)',
              zIndex: 0,
            }} />
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900 mb-4 drop-shadow-lg text-lg md:text-xl flex justify-between items-center group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.1)' }}>
                Finding an internship with Internyl
                <AutoAwesomeOutlinedIcon className="text-[#ffe359] ml-2 group-hover:rotate-12 transition-transform duration-300" />
              </h3>
              <ul className="text-gray-900 space-y-3 list-disc list-inside text-base md:text-lg font-medium" style={{ textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)' }}>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="hover:scale-[1.02] transition-transform duration-200"
                >
                  Use <span className="text-[#3C66C2] font-bold bg-blue-50/50 px-1 rounded">smart filters</span> to explore curated internships & programs
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="hover:scale-[1.02] transition-transform duration-200"
                >
                  View all <span className="text-[#E66646] font-bold bg-red-50/50 px-1 rounded">key info</span> at a glance: deadlines, eligibility, cost
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="hover:scale-[1.02] transition-transform duration-200"
                >
                  <span className="text-[#2BA280] font-bold bg-green-50/50 px-1 rounded">Save listings</span>, set reminders, and <span className="text-[#E66646] font-bold bg-red-50/50 px-1 rounded">never miss a deadline</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <motion.section
        className="mt-24 sm:mt-36 text-center max-w-4xl mx-auto px-2 sm:px-0"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#1d1d1f] to-[#4a4a5a] bg-clip-text text-transparent">
          No more stress,<br />we&apos;ve got you
        </h2>
        <div className="space-y-4 mb-12 text-base text-[#1d1d1f]/70 font-medium leading-relaxed">
          <p>Discover programs easily with our intuitive search features.</p>
          <p>Save programs and receive reminders so that you never miss a deadline.</p>
          <p>Gain access to exclusive information like acceptance rates and release dates not even the program website will tell you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature Card 1 - Enhanced */}
          <motion.div
            className="relative rounded-3xl p-6 sm:p-7 text-center border border-white/40 bg-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-500 hover:shadow-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5, scale: 1.05 }}
          >
            <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover:opacity-80 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(236,100,100,0.1) 50%, rgba(255,255,255,0.2) 100%)', zIndex: 0 }} />
            <div className="relative z-10 flex flex-col h-full">
              <FloatingCard delay={1}>
                <div className="flex items-center justify-center w-24 h-24 mb-6 mx-auto rounded-2xl bg-gradient-to-br from-white/60 to-white/20 shadow-xl backdrop-blur-sm border border-white/30 group-hover:rotate-6 transition-all duration-500">
                  <SearchOutlinedIcon className="text-[#ec6464] text-6xl transform transition-all duration-500 group-hover:scale-110" style={{
                    filter: 'drop-shadow(0 0 12px rgba(236,100,100,0.4))',
                  }} />
                </div>
              </FloatingCard>
              <p className="text-base font-semibold text-gray-900 drop-shadow flex-grow leading-relaxed group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)' }}>Discover programs easily with our intuitive search features.</p>
            </div>
          </motion.div>

          {/* Feature Card 2 - Enhanced */}
          <motion.div
            className="relative rounded-3xl p-6 sm:p-7 text-center border border-white/40 bg-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-500 hover:shadow-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5, scale: 1.05 }}
          >
            <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover:opacity-80 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(43,162,128,0.1) 50%, rgba(255,255,255,0.2) 100%)', zIndex: 0 }} />
            <div className="relative z-10 flex flex-col h-full">
              <FloatingCard delay={2}>
                <div className="flex items-center justify-center w-24 h-24 mb-6 mx-auto rounded-2xl bg-gradient-to-br from-white/60 to-white/20 shadow-xl backdrop-blur-sm border border-white/30 group-hover:rotate-6 transition-all duration-500">
                  <WatchLaterOutlinedIcon className="text-[#2BA280] text-6xl transform transition-all duration-500 group-hover:scale-110" style={{
                    filter: 'drop-shadow(0 0 12px rgba(43,162,128,0.4))',
                  }} />
                </div>
              </FloatingCard>
              <p className="text-base font-semibold text-gray-900 drop-shadow flex-grow leading-relaxed group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)' }}>Save programs and receive reminders so that you never miss a deadline.</p>
            </div>
          </motion.div>

          {/* Feature Card 3 - Enhanced */}
          <motion.div
            className="relative rounded-3xl p-6 sm:p-7 text-center border border-white/40 bg-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-500 hover:shadow-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5, scale: 1.05 }}
          >
            <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover:opacity-80 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(60,102,194,0.1) 50%, rgba(255,255,255,0.2) 100%)', zIndex: 0 }} />
            <div className="relative z-10 flex flex-col h-full">
              <FloatingCard delay={3}>
                <div className="flex items-center justify-center w-24 h-24 mb-6 mx-auto rounded-2xl bg-gradient-to-br from-white/60 to-white/20 shadow-xl backdrop-blur-sm border border-white/30 group-hover:rotate-6 transition-all duration-500">
                  <AutoAwesomeOutlinedIcon className="text-[#3C66C2] text-6xl transform transition-all duration-500 group-hover:scale-110" style={{
                    filter: 'drop-shadow(0 0 12px rgba(60,102,194,0.4))',
                  }} />
                </div>
              </FloatingCard>
              <p className="text-base font-semibold text-gray-900 drop-shadow flex-grow leading-relaxed group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)' }}>Gain access to exclusive information like acceptance rates and release dates.</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <ScrollToTop />

      {/* Enhanced global styles */}
      <style jsx global>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-8px) rotate(1deg); }
        66% { transform: translateY(-4px) rotate(-0.5deg); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(236,100,100,0.3); }
        50% { box-shadow: 0 0 30px rgba(236,100,100,0.5), 0 0 40px rgba(236,100,100,0.2); }
      }
      .hover\\:shadow-3xl:hover {
        box-shadow: 0 25px 80px 0 rgba(0, 0, 0, 0.15);
      }
    `}</style>
    </div>
  );
}

// Main component with proper Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}