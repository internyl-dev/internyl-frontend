/*
    IMPORTANT: NOT IN USE
    DEPRECATED

    REASON: was not able to fully integrate this file into LandingPage.tsx
*/

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { SearchOutlined } from "@mui/icons-material";

export default function LandingPageSearchComponent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    // eslint-disable-next-line no-unused-vars
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            router.push(`/pages/internships?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
    
    return (
        <div className="relative w-full">
            <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
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
                            <SearchOutlined className="w-4 h-4 text-gray-400 mr-3 inline" />
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}