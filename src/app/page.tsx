"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/config/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { motion, useInView } from "framer-motion";

import { Inter, Caveat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import InternshipCards from "@/lib/components/InternshipCards";
import { toggleBookmarkInFirestore } from "@/lib/modules/toggleBookmark";
import { InternshipCards as Internship } from "@/lib/types/internshipCards";
import InternshipReccommendations from "@/lib/components/InternshipRecommendations";
import { useInternshipsWithFallback, useRecommendedInternships } from "@/lib/hooks/useRecommendedInternships";

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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [userData, setUserData] = useState<any>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const router = useRouter();

  const recommendedInternships = useRecommendedInternships();
  const { internshipsToShow, loading } = useInternshipsWithFallback(bookmarked);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      router.push(`/pages/internships?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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

        const querySnapshot = await getDocs(collection(db, "internships"));
        const internshipList = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          if (Array.isArray(data.deadlines)) {
            data.deadlines = data.deadlines.map((d: any) => ({
              ...d,
              date: d.date?.toDate?.() ?? d.date ?? null,
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
    const savedInternshipsFiltered = internships.filter((internship) =>
      userData?.savedInternships?.includes(internship.id)
    );

    return (
      <div className="overflow-hidden">
        {/* Top Section with enhanced gradient */}
        <div className="bg-gradient-to-br from-[#9381FF] via-[#A891FF] to-[#9381FF] text-white relative">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-20 md:pb-28 relative text-right z-10">
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
                Beware, {userData?.displayName?.split(" ")[0] || user.displayName?.split(" ") || "Intern"}
              </motion.h1>
              <motion.p
                className={`text-left text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-[115%] tracking-[-0.05em] ${caveat.className} drop-shadow-md`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                An internship deadline is near
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Middle Section with enhanced styling */}
        <motion.div
          className="relative bg-white/40 backdrop-blur-xl rounded-tl-[30px] rounded-bl-[30px] mt-6 mx-2 sm:mx-4 text-[#2F2F3A] flex flex-col max-w-full shadow-2xl border border-white/20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-6 md:px-12 lg:px-20 pt-10 md:pt-18 pb-8 md:pb-12 gap-4 md:gap-0">
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
              {savedInternshipsFiltered.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  className="flex-shrink-0 min-w-[280px] max-w-xs md:max-w-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <InternshipCards
                    internships={[internship]}
                    bookmarked={bookmarked}
                    toggleBookmark={toggleBookmark}
                  />
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
        {/* Suggested Internships Section */}
        <motion.div
          className="relative bg-white/40 backdrop-blur-xl rounded-tl-[30px] rounded-bl-[30px] mt-10 mx-2 sm:mx-4 text-[#2F2F3A] flex flex-col max-w-full shadow-2xl border border-white/20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-6 md:px-12 lg:px-20 pt-10 md:pt-18 pb-8 md:pb-12 gap-4 md:gap-0">
            <div className="flex flex-col items-start w-full md:w-auto">
              <p className="text-base sm:text-lg md:text-[18px] text-[#A2A2C7] tracking-[-0.04em] mb-1 font-medium">
                Recommended for you
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-r from-[#2F2F3A] to-[#5A5A6B] bg-clip-text text-transparent">
                Suggested Internships
              </h2>
            </div>
            <Link
              href="/pages/internships" // or wherever your full internships page is
              className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-[18px] font-medium text-white bg-gradient-to-r from-[#E26262] to-[#F07575] rounded-full gap-2 sm:gap-3.5 hover:from-[#d65050] hover:to-[#e66666] transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap mt-4 md:mt-0 border border-white/20"
            >
              see all
              <ArrowForwardIcon className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="overflow-x-auto px-2 sm:px-6 md:px-12 lg:px-20 pb-8 md:pb-10">
            <div className="flex w-max md:w-full gap-6">
              {internshipsToShow.length === 0 ? (
                <p className="px-4 text-gray-500">No internships available.</p>
              ) : (
                internshipsToShow.map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    className="flex-shrink-0 min-w-[280px] max-w-xs md:max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
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
      </div>
    );
  }

  // Enhanced Public Landing Page
  return (
    <div className="text-[#1d1d1f] px-2 sm:px-6 md:px-12 lg:px-20 pt-16 sm:pt-24 pb-20 sm:pb-32 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-[#ec6464]/10 to-[#9381FF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#2BA280]/10 to-[#3C66C2]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section with enhanced animations */}
      <section className="max-w-7xl mx-auto relative z-10 mr-auto ml-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className={`text-transparent bg-gradient-to-r from-[#ec6464] to-[#f07575] bg-clip-text font-extrabold ${inter.className} drop-shadow-sm`}>Streamline</span><br />
              <span>your search,</span><br />
              Secure <span className={`italic font-extrabold ${caveat.className} text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-gradient-to-r from-[#9381FF] to-[#A891FF] bg-clip-text`}>your</span><br />
              <span className={`italic font-extrabold ${caveat.className} text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-gradient-to-r from-[#2BA280] to-[#3C66C2] bg-clip-text`}>future</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-[#1d1d1f]/80 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Internyl helps students find and track internships and programs — all in one place.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <form
                className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-xl"
                onSubmit={handleSearch}
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="search for your dream internship"
                    className="px-6 py-4 rounded-2xl text-base w-full shadow-lg border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#ec6464]/50 focus:border-[#ec6464] transition-all duration-300 hover:shadow-xl font-medium placeholder:text-gray-400"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ec6464]/5 to-[#9381FF]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <button
                  type="submit"
                  className="group mx-auto bg-gradient-to-r from-[#ec6464] to-[#f07575] hover:from-[#d65050] hover:to-[#e66666] text-white px-8 py-4 rounded-2xl font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center whitespace-nowrap text-base min-w-[180px] min-h-[56px] shadow-xl hover:shadow-2xl transform hover:scale-105 border border-white/20"
                >
                  <span className="inline-flex items-center gap-2">
                    <RocketLaunchIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    begin search
                    <ArrowForwardIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </form>
              <motion.div
                className="flex justify-center w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src="/free-text.svg"
                  width={200}
                  height={54}
                  alt="Free to use"
                  className="mt-2 sm:mt-3 w-auto h-12 sm:h-14 drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(236,100,100,0.15))' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hidden md:flex justify-end w-full"
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <FloatingCard delay={0.5}>
              <Image
                src="/internyl-infinite-cards.svg"
                alt="Internship tiles visual"
                className="drop-shadow-2xl object-left overflow-x-hidden w-[220px] md:w-[340px] lg:w-[440px] xl:w-[540px] h-auto hover:scale-105 transition-transform duration-500 ease-out"
                width={540}
                height={540}
              />
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Comparison Section */}
      <motion.section
        className="mt-32 text-center"
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
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
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
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
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
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
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