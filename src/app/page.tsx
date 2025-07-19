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

import InternshipCards from "@/lib/components/InternshipCards";
import { toggleBookmarkInFirestore } from "@/lib/modules/toggleBookmark";
import { InternshipCards as Internship } from "@/lib/types/internshipCards";

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

// Animated Strikethrough List Component
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
      className="text-gray-800 space-y-2 list-disc list-inside text-base md:text-lg font-medium"
      style={{textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)'}}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          className="relative"
          initial={{ opacity: 0.4 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0.4 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
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
                duration: 0.6,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
            />
          </span>
        </motion.li>
      ))}
    </ul>
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
        {/* Top Section */}
        <div className="bg-[#9381FF] text-white">
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-20 md:pb-28 relative text-right">
            <div className="inline-block max-w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold">
                Beware, {userData?.displayName?.split(" ")[0] || user.displayName?.split(" ") || "Intern"}
              </h1>
              <p className={`text-left text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-[115%] tracking-[-0.05em] ${caveat.className}`}>
                An internship deadline is near
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="relative bg-white/30 backdrop-blur-md rounded-tl-[25px] rounded-bl-[25px] mt-6 mx-2 sm:mx-4 text-[#2F2F3A] flex flex-col max-w-full shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-6 md:px-12 lg:px-20 pt-10 md:pt-18 pb-8 md:pb-12 gap-4 md:gap-0">
            <div className="flex flex-col items-start w-full md:w-auto">
              <p className="text-base sm:text-lg md:text-[18px] text-[#A2A2C7] tracking-[-0.04em] mb-1">
                Track your internships
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold">Your Internships</h2>
            </div>
            <Link
              href="/pages/internships"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-[18px] font-light text-white bg-[#E26262] rounded-full gap-2 sm:gap-3.5 hover:bg-[#d65050] transition-colors duration-200 cursor-pointer shadow-lg whitespace-nowrap mt-4 md:mt-0"
            >
              see all <ArrowForwardIcon className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Scrollable Internship Cards */}
          <div className="overflow-x-auto px-2 sm:px-6 md:px-12 lg:px-20 pb-6 md:pb-8">
            <div className="flex w-max md:w-full gap-4">
              {savedInternshipsFiltered.map((internship) => (
                <div key={internship.id} className="flex-shrink-0 min-w-[260px] max-w-xs md:max-w-sm">
                  <InternshipCards
                    internships={[internship]}
                    bookmarked={bookmarked}
                    toggleBookmark={toggleBookmark}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Public Landing Page
  return (
    <div className="text-[#1d1d1f] px-2 sm:px-6 md:px-12 lg:px-20 pt-16 sm:pt-24 pb-20 sm:pb-32 relative overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative z-10 mr-auto ml-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          <div className="text-center lg:text-left w-full mt-8 sm:mt-10">
            <p className="text-sm text-[#8d8dac] font-medium mb-2">
              Internyl — Internship Tracker for Students
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className={`text-[#ec6464] font-extrabold ${inter.className}`}>Streamline</span><br />
              <span>your search,</span><br />
              Secure <span className={`italic font-extrabold ${caveat.className} text-3xl sm:text-5xl md:text-6xl lg:text-7xl`}>your</span><br />
              <span className={`italic font-extrabold ${caveat.className} text-3xl sm:text-5xl md:text-6xl lg:text-7xl`}>future</span>
            </h1>
            <p className="mt-4 text-lg text-[#1d1d1f]">
              Internyl helps students find and track internships and programs — all in one place.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              <form
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full max-w-lg"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="search for your dream internship"
                  className="px-4 sm:px-6 py-3 sm:py-3 rounded-full text-base w-full shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#ec6464] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="mx-auto bg-[#ec6464] text-white px-8 py-3 rounded-full font-semibold cursor-pointer hover:bg-[#d65050] transition-colors duration-200 flex items-center justify-center whitespace-nowrap text-base min-w-[160px] min-h-[48px]"
                  style={{boxShadow: '0 2px 12px 0 rgba(236,100,100,0.10)'}}
                >
                  <span className="inline-flex items-center gap-0.5">
                    begin search →
                  </span>
                </button>
              </form>
              <div className="flex justify-center w-full">
                <Image
                  src="/free-text.svg"
                  width={180}
                  height={48}
                  alt="Free to use"
                  className="mt-2 sm:mt-3 w-auto h-10 sm:h-12 drop-shadow-lg"
                  style={{filter: 'drop-shadow(0 2px 12px rgba(236,100,100,0.12))'}}
                />
              </div>
            </div>

          </div>


          <div className="hidden md:flex justify-end w-full">
            <Image
              src="/internyl-infinite-cards.svg"
              alt="Internship tiles visual"
              className="drop-shadow-2xl object-left overflow-x-hidden w-[220px] md:w-[340px] lg:w-[440px] xl:w-[540px] h-auto"
              width={540}
              height={540}
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="mt-32 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Skip the search, <br className="sm:hidden" />just choose and apply
        </h2>
        <p className="text-base text-[#1d1d1f] mb-10">
          Internyl simplifies the entire search, so you can focus on applying.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 sm:gap-6 max-w-5xl mx-auto text-md">
          {/* Without Internyl Card */}
          <div
            className="relative w-full md:w-1/2 p-5 sm:p-7 text-left rounded-2xl shadow-xl  backdrop-blur-2xl overflow-hidden min-w-[220px]"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(236,100,100,0.10) 100%)',
              zIndex: 0,
            }} />
            <div className="relative z-10">
              <h3 className="font-semibold text-gray-900 mb-3 drop-shadow-lg text-lg md:text-xl flex justify-between items-center" style={{textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.10)'}}>
                Finding an internship without Internyl
                <ThumbDownOutlinedIcon style={{ color: '#e02b2b', paddingLeft: "3px" }} />
              </h3>
              <AnimatedStrikethroughList />
            </div>
          </div>

          {/* With Internyl Card */}
          <div
            className="relative w-full md:w-1/2 p-5 sm:p-7 text-left rounded-2xl shadow-xl border border-white bg-white/10 backdrop-blur-2xl overflow-hidden min-w-[220px]"
            style={{
              boxShadow: '0 10px 36px 0 rgba(44, 102, 194, 0.2)',
            }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(44,162,128,0.1) 100%)',
              zIndex: 0,
            }} />
            <div className="relative z-10">
              <h3 className="font-semibold text-gray-900 mb-3 drop-shadow-lg text-lg md:text-xl flex justify-between items-center" style={{textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.1)'}}>
                Finding an internship with Internyl
                <AutoAwesomeOutlinedIcon sx={{ color: "#ffe359", paddingLeft: "2px", }}/>
              </h3>
              <ul className="text-gray-900 space-y-2 list-disc list-inside text-base md:text-lg font-medium" style={{textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)'}}>
                <li>
                  Use <span className="text-[#3C66C2] font-semibold">smart filters</span> to explore curated internships & programs
                </li>
                <li>
                  View all <span className="text-[#E66646] font-semibold">key info</span> at a glance: deadlines, eligibility, cost
                </li>
                <li>
                  <span className="text-[#2BA280] font-semibold">Save listings</span>, set reminders, and <span className="text-[#E66646] font-semibold">never miss a deadline</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </section >

    {/* Features Section */ }
    <section className="mt-20 sm:mt-32 text-center max-w-3xl mx-auto px-2 sm:px-0">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">No more stress,<br />we&apos;ve got you</h2>
        <p className="text-base mb-3">Discover programs easily with our intuitive search features.</p>
        <p className="text-base mb-3">Save programs and receive reminders so that you never miss a deadline.</p>
        <p className="text-base mb-8">Gain access to exclusive information like acceptance rates and release dates not even the program website will tell you.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Feature Card 1 */}
          <div className="relative rounded-2xl p-4 sm:p-5 text-center border border-white/30 bg-white/10 backdrop-blur-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(236,100,100,0.08) 100%)', zIndex: 0}} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-center w-20 h-20 mb-6 mx-auto rounded-full bg-gradient-to-br from-white/50 to-white/10 shadow-lg backdrop-blur-sm border border-white/20" style={{
                animation: 'float 4s ease-in-out infinite',
              }}>
                <SearchOutlinedIcon className="text-[#ec6464] text-5xl transform transition-transform hover:scale-110 duration-300" style={{
                  filter: 'drop-shadow(0 0 8px rgba(236,100,100,0.3))',
                }} /> 
              </div>
              <p className="text-base font-medium text-gray-900 drop-shadow flex-grow" style={{textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)'}}>Discover programs easily with our intuitive search features.</p>
            </div>
          </div>
          {/* Feature Card 2 */}
          <div className="relative rounded-2xl p-4 sm:p-5 text-center border border-white/30 bg-white/10 backdrop-blur-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(44,162,128,0.08) 100%)', zIndex: 0}} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-center w-20 h-20 mb-6 mx-auto rounded-full bg-gradient-to-br from-white/50 to-white/10 shadow-lg backdrop-blur-sm border border-white/20" style={{
                animation: 'float 4s ease-in-out infinite',
                animationDelay: '1.333s',
              }}>
                <WatchLaterOutlinedIcon className="text-[#2BA280] text-5xl transform transition-transform hover:scale-110 duration-300" style={{
                  filter: 'drop-shadow(0 0 8px rgba(43,162,128,0.3))',
                }} />
              </div>
              <p className="text-base font-medium text-gray-900 drop-shadow flex-grow" style={{textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)'}}>Save programs and receive reminders so that you never miss a deadline.</p>
            </div>
          </div>
          {/* Feature Card 3 */}
          <div className="relative rounded-2xl p-4 sm:p-5 text-center border border-white/30 bg-white/10 backdrop-blur-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(44,102,194,0.08) 100%)', zIndex: 0}} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-center w-20 h-20 mb-6 mx-auto rounded-full bg-gradient-to-br from-white/50 to-white/10 shadow-lg backdrop-blur-sm border border-white/20" style={{
                animation: 'float 4s ease-in-out infinite',
                animationDelay: '2.666s',
              }}>
                <AutoAwesomeOutlinedIcon className="text-[#3C66C2] text-5xl transform transition-transform hover:scale-110 duration-300" style={{
                  filter: 'drop-shadow(0 0 8px rgba(60,102,194,0.3))',
                }} />
              </div>
              <p className="text-base font-medium text-gray-900 drop-shadow flex-grow" style={{textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)'}}>Gain access to exclusive information like acceptance rates and release dates.</p>
            </div>
          </div>
        </div>
      </section>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}