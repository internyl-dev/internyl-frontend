"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, Filter, Search, SlidersHorizontal, BookmarkCheck, Clock, Users, DollarSign, Calendar, RotateCcw } from "lucide-react";
import SearchBar from "@/lib/components/SearchBar";
import InternshipCards from "@/lib/components/InternshipCards";
import { toggleBookmarkInFirestore } from "@/lib/modules/toggleBookmark";
import { InternshipCards as InternshipType, Deadline, CostsSection } from "@/lib/types/internshipCards";

// Firebase
import { auth, db } from "@/lib/config/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const sortOptions = [
  { value: "relevance", label: "Best Match" },
  { value: "deadline", label: "Deadline (Soonest)" },
  { value: "cost-low", label: "Cost (Low to High)" },
  { value: "cost-high", label: "Cost (High to Low)" },
  { value: "duration", label: "Duration (Shortest)" },
  { value: "alphabetical", label: "A to Z" },
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

function InternshipsContent() {
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [internships, setInternships] = useState<InternshipType[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState(Date.now());
  const [dynamicSubjects, setDynamicSubjects] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const router = useRouter();

  const filterData = [
    {
      label: "Due in",
      color: "bg-[#f7d7db]",
      icon: Clock,
      options: ["Past Due", "Due Today", "Due This Week", "Due This Month"],
    },
    {
      label: "Subject",
      color: "bg-[#e4e8f6]",
      icon: BookmarkCheck,
      options: dynamicSubjects,
    },
    {
      label: "Cost",
      color: "bg-[#f4e3f2]",
      icon: DollarSign,
      options: ["Free", "Under $1000", "$1000–$3000", "$3000+"],
    },
    {
      label: "Eligibility",
      color: "bg-[#f9e4cb]",
      icon: Users,
      options: ["Freshman", "Sophomores", "Juniors", "Seniors", "College Students"],
    },
    {
      label: "Duration",
      color: "bg-[#def0ea]",
      icon: Calendar,
      options: ["1 week", "2–4 weeks", "1–2 months", "Full Summer"],
    },
  ];

  function getEarliestDeadlineDate(deadlines: Deadline[]): Date | null {
    if (!deadlines || deadlines.length === 0) return null;
    
    const validDates = deadlines
      .map((d) => (d.date && d.date !== "not provided" ? new Date(d.date) : null))
      .filter((date): date is Date => !!date && !isNaN(date.getTime()));

    if (validDates.length === 0) return null;

    return validDates.reduce((earliest, current) =>
      current < earliest ? current : earliest
    );
  }

  function getCostValue(costs: CostsSection): number {
    if (!costs || !costs.costs || costs.costs.length === 0) {
      return 0; // Consider as free if no cost data
    }

    const allCosts = costs.costs
      .filter((item) => typeof item.lowest === "number")
      .map((item) => item.lowest as number);

    if (allCosts.length === 0) return 0; // Consider as free if no numeric costs

    return Math.min(...allCosts);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown') && !target.closest('.filter-button') && !target.closest('.sort-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-hide mobile filters when desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileFilters(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function isTimestamp(value: unknown): value is { toDate: () => Date } {
    return (
      value !== null &&
      typeof value === "object" &&
      "toDate" in value &&
      typeof (value as { toDate?: unknown }).toDate === "function"
    );
  }

  useEffect(() => {
    async function fetchInternships() {
      try {
        const internshipsCollection = collection(db, "internships-history");
        const snapshot = await getDocs(internshipsCollection);

        const fetchedInternships = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Defensive check: deadlines might be undefined
          const deadlines = (data.dates?.deadlines ?? []).map((deadline: Deadline) => {
            const dateVal = deadline.date;

            return {
              ...deadline,
              date: isTimestamp(dateVal)
                ? dateVal.toDate().toISOString().split("T")[0]
                : typeof dateVal === "string"
                  ? dateVal
                  : null,
            };
          });

          const dates = {
            ...data.dates,
            deadlines,
          };

          return {
            id: doc.id,
            overview: data.overview,
            eligibility: data.eligibility,
            dates,
            locations: data.locations,
            costs: data.costs,
            contact: data.contact,
          } as InternshipType;
        });

        // Extract unique subjects from all internships
        const subjectsSet = new Set<string>();
        fetchedInternships.forEach((internship) => {
          if (internship.overview?.subject && Array.isArray(internship.overview.subject)) {
            internship.overview.subject.forEach((subject) => {
              if (subject && typeof subject === 'string') {
                // Capitalize first letter and clean up the subject
                const cleanSubject = subject.trim();
                if (cleanSubject) {
                  const capitalizedSubject = cleanSubject.charAt(0).toUpperCase() + cleanSubject.slice(1).toLowerCase();
                  subjectsSet.add(capitalizedSubject);
                }
              }
            });
          }
        });

        // Convert to sorted array
        const uniqueSubjects = Array.from(subjectsSet).sort();
        setDynamicSubjects(uniqueSubjects);
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

    // Optimistic update for better UX
    setBookmarked((prev) => ({
      ...prev,
      [internshipId]: !isBookmarked,
    }));

    try {
      await toggleBookmarkInFirestore(internshipId, isBookmarked);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      // Revert on error
      setBookmarked((prev) => ({
        ...prev,
        [internshipId]: isBookmarked,
      }));
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
    setLastSearchTime(Date.now()); // Trigger re-sort
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
    setShowBookmarkedOnly(false);
    setSortBy("relevance");
  };

  const clearCategoryFilter = (category: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[category];
      return newFilters;
    });
  };

  const getFilterColor = (category: string) => {
    return filterData.find(f => f.label === category)?.color || "bg-gray-200";
  };

  const calculateRelevanceScore = (internship: InternshipType, searchTerm: string): number => {
    if (!searchTerm) return 1; // No search term, all equally relevant

    const search = searchTerm.toLowerCase().trim();
    const title = (internship.overview?.title || '').toLowerCase();
    const provider = (internship.overview?.provider || '').toLowerCase();
    const description = (internship.overview?.description || '').toLowerCase();

    // Handle subjects - can be array or empty
    let subjects: string[] = [];
    if (internship.overview?.subject && Array.isArray(internship.overview.subject)) {
      subjects = internship.overview.subject.map(s => String(s).toLowerCase());
    }

    let score = 0;

    // Title matches (highest weight)
    if (title.includes(search)) {
      score += title.startsWith(search) ? 10 : 5;
    }

    // Provider matches
    if (provider.includes(search)) {
      score += provider.startsWith(search) ? 4 : 2;
    }

    // Subject matches
    if (subjects.some(s => s.includes(search))) {
      const isExact = subjects.some(s => s === search);
      score += isExact ? 6 : 3;
    }

    // Description matches (lower weight)
    if (description.includes(search)) {
      score += 1;
    }

    // Word-by-word matching for multi-word searches
    const searchWords = search.split(' ').filter(word => word.length > 2);
    searchWords.forEach(word => {
      if (title.includes(word)) score += 2;
      if (provider.includes(word)) score += 1;
      if (subjects.some(s => s.includes(word))) score += 1.5;
    });

    // Boost bookmarked items slightly
    if (bookmarked[internship.id]) score += 1;

    // Penalty for very long titles
    if (title.length > 60) score *= 0.9;

    // Boost if multiple fields match
    const fieldsMatched = [title, provider, description, ...subjects].filter(field => field.includes(search)).length;
    if (fieldsMatched > 1) score *= 1.2;

    return score;
  };

  const sortInternships = (internships: InternshipType[], sortBy: string, searchTerm: string) => {
    const sorted = [...internships];

    switch (sortBy) {
      case "deadline":
        return sorted.sort((a, b) => {
          const aDate = getEarliestDeadlineDate(a.dates?.deadlines || []);
          const bDate = getEarliestDeadlineDate(b.dates?.deadlines || []);
          if (!aDate && !bDate) return 0;
          if (!aDate) return 1;
          if (!bDate) return -1;
          return aDate.getTime() - bDate.getTime();
        });

      case "cost-low":
        return sorted.sort((a, b) => {
          const aCost = getCostValue(a.costs);
          const bCost = getCostValue(b.costs);
          return aCost - bCost;
        });

      case "cost-high":
        return sorted.sort((a, b) => {
          const aCost = getCostValue(a.costs);
          const bCost = getCostValue(b.costs);
          return bCost - aCost;
        });

      case "duration":
        return sorted.sort((a, b) => {
          const aDuration = typeof a.dates?.duration_weeks === "number" ? a.dates.duration_weeks : 0;
          const bDuration = typeof b.dates?.duration_weeks === "number" ? b.dates.duration_weeks : 0;
          return aDuration - bDuration;
        });

      case "alphabetical":
        return sorted.sort((a, b) => (a.overview?.title || '').localeCompare(b.overview?.title || ''));

      case "relevance":
      default:
        return sorted.sort((a, b) => {
          const aScore = calculateRelevanceScore(a, searchTerm);
          const bScore = calculateRelevanceScore(b, searchTerm);
          if (bScore !== aScore) return bScore - aScore;
          return (a.overview?.title || '').localeCompare(b.overview?.title || '');
        });
    }
  };

  const filteredAndSortedInternships = useMemo(() => {
    const filtered = internships.filter((internship) => {
      // Search filter
      const title = internship.overview?.title || '';
      const provider = internship.overview?.provider || '';
      const subjects = Array.isArray(internship.overview?.subject) ? internship.overview.subject : [];
      
      const searchableText = `${title} ${provider} ${subjects.join(" ")}`.toLowerCase();
      if (searchTerm && !searchableText.includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Bookmarked only filter
      if (showBookmarkedOnly && !bookmarked[internship.id]) {
        return false;
      }

      // Category filters
      return Object.entries(activeFilters).every(([category, selectedOptions]) => {
        if (selectedOptions.length === 0) return true;

        switch (category) {
          case "Due in": {
            const deadlines = internship.dates?.deadlines || [];
            if (deadlines.length === 0) return false;
            
            const firstDeadline = deadlines[0];
            if (!firstDeadline || !firstDeadline.date || firstDeadline.date === "not provided") {
              return false;
            }
            
            const dateObj = new Date(firstDeadline.date);
            if (isNaN(dateObj.getTime())) return false;
            
            const dueCategory = getDueCategory(dateObj);
            return selectedOptions.includes(dueCategory);
          }

          case "Subject": {
            const subjects = internship.overview?.subject || [];
            if (!Array.isArray(subjects) || subjects.length === 0) return false;
            
            return selectedOptions.some(selectedSubject => 
              subjects.some(internshipSubject => {
                const subjectStr = String(internshipSubject).toLowerCase();
                const selectedStr = selectedSubject.toLowerCase();
                return subjectStr.includes(selectedStr) || selectedStr.includes(subjectStr);
              })
            );
          }

          case "Cost": {
            const costs = internship.costs?.costs || [];
            
            // Get all numeric cost values
            const numericCosts = costs
              .filter(item => typeof item.lowest === "number")
              .map(item => item.lowest as number);

            // If no costs or all costs are 0, consider it free
            const minCost = numericCosts.length === 0 ? 0 : Math.min(...numericCosts);

            return selectedOptions.some((opt) => {
              switch (opt) {
                case "Free":
                  return minCost === 0;
                case "Under $1000":
                  return minCost > 0 && minCost < 1000;
                case "$1000–$3000":
                  return minCost >= 1000 && minCost <= 3000;
                case "$3000+":
                  return minCost > 3000;
                default:
                  return false;
              }
            });
          }

          case "Eligibility": {
            const grades = internship.eligibility?.eligibility?.grades || [];

            return selectedOptions.some((opt) => {
              switch (opt) {
                case "Freshman":
                  return grades.some(grade => 
                    String(grade).toLowerCase() === "freshman"
                  );
                case "Sophomores":
                  return grades.some(grade => 
                    String(grade).toLowerCase() === "sophomore"
                  );
                case "Juniors":
                  return grades.some(grade => 
                    String(grade).toLowerCase() === "junior"
                  );
                case "Seniors":
                  return grades.some(grade => 
                    String(grade).toLowerCase() === "senior"
                  );
                case "College Students":
                  return grades.some(grade => 
                    String(grade).toLowerCase() === "undergraduate" || String(grade).toLowerCase() === "college"
                  );
                default:
                  return false;
              }
            });
          }

          case "Duration": {
            const duration = internship.dates?.duration_weeks;
            if (typeof duration !== "number") return false;

            return selectedOptions.some((opt) => {
              switch (opt) {
                case "1 week":
                  return duration <= 1;
                case "2–4 weeks":
                  return duration > 1 && duration <= 4;
                case "1–2 months":
                  return duration > 4 && duration <= 8;
                case "Full Summer":
                  return duration > 8;
                default:
                  return false;
              }
            });
          }

          default:
            return true;
        }
      });
    });

    return sortInternships(filtered, sortBy, searchTerm);
  }, [internships, activeFilters, searchTerm, showBookmarkedOnly, sortBy, bookmarked, lastSearchTime]);

  const totalActiveFilters = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0);
  const hasBookmarkedInternships = Object.values(bookmarked).some(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen radial-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen radial-bg text-gray-800 px-4 mb-8">
      <SearchBar setSearch={setSearchTerm} initialValue={initialSearch} />

      {/* Sort and View Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 mt-8">
        {/* Sort Dropdown */}
        <div className="relative sort-dropdown-container">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'sort' && (
            <div className="absolute top-12 left-0 w-56 bg-white rounded-xl shadow-lg p-2 z-20 border">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortBy(option.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors ${sortBy === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked Only Toggle */}
        {user && hasBookmarkedInternships && (
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${showBookmarkedOnly
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            Bookmarked Only
            {showBookmarkedOnly && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(bookmarked).filter(Boolean).length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(totalActiveFilters > 0 || searchTerm || showBookmarkedOnly) && (
        <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
          {searchTerm && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm">
              <Search className="w-3 h-3" />
              <span>&quot;{searchTerm}&quot;</span>
              <button
                onClick={() => setSearchTerm("")}
                className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {showBookmarkedOnly && (
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
              <BookmarkCheck className="w-3 h-3" />
              <span>Bookmarked</span>
              <button
                onClick={() => setShowBookmarkedOnly(false)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
          {(totalActiveFilters > 0 || searchTerm || showBookmarkedOnly) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-center mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-medium transition-colors ${showMobileFilters ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700'
            } border`}
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
            const Icon = filter.icon;
            return (
              <div key={filter.label} className="relative filter-dropdown">
                <button
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === filter.label ? null : filter.label))
                  }
                  className={`filter-button flex items-center gap-2 px-4 py-2 rounded-full ${filter.color} text-black text-sm font-semibold shadow-sm hover:brightness-95 transition ${hasActiveOptions ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                  {hasActiveOptions && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilters[filter.label].length}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 mt-[1px] transition-transform ${openDropdown === filter.label ? 'rotate-180' : ''
                    }`} />
                </button>

                {openDropdown === filter.label && (
                  <div className="absolute top-12 left-0 w-48 bg-white rounded-xl shadow-lg p-3 space-y-2 z-20 border">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b">
                      <span className="text-sm font-medium text-gray-700">{filter.label}</span>
                      {hasActiveOptions && (
                        <button
                          onClick={() => clearCategoryFilter(filter.label)}
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
      {filteredAndSortedInternships.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No internships found</div>
          <p className="text-gray-400 text-sm mb-4">
            {showBookmarkedOnly
              ? "You don&apos;t have any bookmarked internships matching these filters"
              : "Try adjusting your search terms or filters"}
          </p>
          {(totalActiveFilters > 0 || searchTerm || showBookmarkedOnly) && (
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
        internships={filteredAndSortedInternships}
        bookmarked={bookmarked}
        toggleBookmark={toggleBookmark}
      />
    </div>
  );
}

export default function Internships() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InternshipsContent />
    </Suspense>
  );
}