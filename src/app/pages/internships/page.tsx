"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import SearchBar from "@/lib/components/SearchBar";
import InternshipCards from "@/lib/components/InternshipCards";
import { sampleInternshipData } from "@/lib/test/sample";
import { getDaysRemaining } from "@/lib/modules/getTimeRemaining";

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

export default function Internships() {
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<{ [key: number]: boolean }>({});

  const toggleBookmark = (idx: number) => {
    setBookmarked((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
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

  return (
    <div className="min-h-screen radial-bg text-gray-800 px-4">
      <SearchBar />

      {/* Filter bar */}
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
                  <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
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

      {/* Cards with data and state */}
      <InternshipCards
        internships={sampleInternshipData}
        bookmarked={bookmarked}
        toggleBookmark={toggleBookmark}
      />
    </div>
  );
}
