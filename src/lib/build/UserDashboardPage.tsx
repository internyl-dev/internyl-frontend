import { motion } from "framer-motion";
import ScrollToTop from "../components/ScrollToTop";
import { Link } from "lucide-react";
import Brushstroke from "../components/Brushstroke";
import { InsightsWidget } from "../components/InsightsWidget";
import InternshipCards from "../components/InternshipCards";
import { caveat } from "../utils/fonts";
import { UserData } from "../interfaces/UserData";
import { useState } from "react";
import { User } from "firebase/auth";
import { InternshipCards as Internship } from "@/lib/interfaces/internshipCards";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useInternshipsWithFallback } from "@/lib/hooks/useRecommendedInternships";
import { toggleBookmarkInFirestore } from "../modules/toggleBookmark";

export default function UserDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [internships, setInternships] = useState<Internship[]>([]);
    const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});

    const { internshipsToShow } = useInternshipsWithFallback(bookmarked);

    const savedInternshipsFiltered = internships.filter((internship) =>
        userData?.savedInternships?.includes(internship.id)
    )

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

    return (
        <>
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
                                Beware, {userData?.displayName?.split(" ")[0] || user?.displayName?.split(" ")[0] || "Intern"}
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
        </>
    )
}