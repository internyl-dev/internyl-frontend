"use client";

import Image from "next/image";
import ScrollToTop from "@/lib/components/ScrollToTop";

import { motion } from "framer-motion";
import { kalam, inter } from "@/lib/utils/fonts";

import { ArrowForward } from "@mui/icons-material";
import LandingPageSearchComponent from "@/lib/components/LandingPageSearchComponent";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FloatingCard } from "../components/FloatingCard";

import {
    ThumbDownOutlined as ThumbDownOutlinedIcon,
    AutoAwesomeOutlined as AutoAwesomeOutlinedIcon,
    SearchOutlined as SearchOutlinedIcon,
    WatchLaterOutlined as WatchLaterOutlinedIcon

} from "@mui/icons-material";
import { AnimatedStrikethroughList } from "../components/AnimatedStrikethroughList";

export default function LandingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    // eslint disable-next-line no-unused-vars
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = (value: React.FormEvent<HTMLFormElement>) => {
        value.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/internships?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

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
                                        <ArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
            <style jsx global>
                {`
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
                `}
            </style>
        </div>
    )
}