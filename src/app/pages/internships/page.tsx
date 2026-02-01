"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, Filter, Search, SlidersHorizontal, BookmarkCheck, Clock, Users, DollarSign, Calendar, RotateCcw } from "lucide-react";
import SearchBar from "@/lib/components/SearchBar";
import InternshipCards from "@/lib/components/InternshipCards";
import { toggleBookmarkInFirestore } from "@/lib/modules/toggleBookmark";
import { InternshipCards as InternshipType, Deadline, CostsSection } from "@/lib/interfaces/internshipCards";


import { auth, db } from "@/lib/config/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDueCategory } from "@/lib/modules/getDueCategory";
import { getEarliestDeadlineDate } from "@/lib/modules/getEarliestDeadlineDate";
import { getCostValue } from "@/lib/modules/getCostValue";
import InternshipsLoadingScreen from "@/lib/build/InternshipsLoadingScreen";

const sortOptions = [
  { value: "relevance", label: "Best Match" },
  { value: "deadline", label: "Deadline (Soonest)" },
  { value: "cost-low", label: "Cost (Low to High)" },
  { value: "cost-high", label: "Cost (High to Low)" },
  { value: "duration", label: "Duration (Shortest)" },
  { value: "alphabetical", label: "A to Z" },
];

function InternshipsContent() {
  const motivationalPhrases = [
    "Discover your next adventure today! 🚀",
    "Your dream internship is just a search away ✨",
    "Transform your summer into something extraordinary 🌟",
    "Find the perfect opportunity to grow and learn 📚",
    "Take the first step toward your bright future 🌅",
    "Unlock new possibilities with every click 🔓",
    "Your journey to success starts here 🎯",
    "Explore programs that will shape your tomorrow 🔮",
    "Turn your passion into real-world experience 💡",
    "Every great career begins with a single opportunity 🌱",
    "Ready to make this summer count? Let's go! ⚡",
    "Find internships that match your ambitions 🎨",
    "Your next chapter is waiting to be written ✍️",
    "Dive into experiences that will inspire you 🌊",
    "Connect your interests with amazing opportunities 🔗",
    "Build the foundation for your dream career 🏗️",
    "Discover programs tailored just for you 🎪",
    "Step out of your comfort zone and into greatness 🦋",
    "Find your place in the world of innovation 🌍",
    "Today's search could change your entire future 🌈"

  ];
  useEffect(() => {
    // Gradient animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient {
        animation: gradient 6s ease infinite;
      }
      .bg-300\\% {
        background-size: 300% 300%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const getRandomPhrase = () => {
    return motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
  };

  const [motivationalPhrase] = useState(() => getRandomPhrase());

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [customCostRange, setCustomCostRange] = useState([0, 10000]);
  const [showCustomCostInput, setShowCustomCostInput] = useState(false);
  const [maxCost, setMaxCost] = useState(10000);
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
      options: ["Past Due", "Due Today", "Due This Week", "Due This Month", "Later"],
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
      options: ["Free", "Under $1000", "$1000–$3000", "$3000+", "Custom Range"],
    },
    {
      label: "Eligibility",
      color: "bg-[#f9e4cb]",
      icon: Users,
      options: ["Freshman", "Sophomores", "Juniors", "Seniors", "Rising Freshman", "Rising Sophomore", "Rising Junior", "Rising Senior", "College Students"],
    },
    {
      label: "Duration",
      color: "bg-[#def0ea]",
      icon: Calendar,
      options: ["1 week", "2–4 weeks", "1–2 months", "Full Summer"],
    },
  ];

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

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setShowMobileFilters(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
        const internshipsCollection = collection(db, "programs-display");
        const snapshot = await getDocs(internshipsCollection);

        let highestCost = 0;
        const fetchedInternships = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Check: deadlines might be undefined
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
          // Find highest cost
          if (data.costs?.costs && Array.isArray(data.costs.costs)) {
            data.costs.costs.forEach((item: { lowest?: number; highest?: number;[key: string]: unknown }) => {
              if (typeof item.highest === 'number' && item.highest > highestCost) {
                highestCost = item.highest;
              } else if (typeof item.lowest === 'number' && item.lowest > highestCost) {
                highestCost = item.lowest;
              }
            });
          }
          return {
            id: doc.id,
            overview: data.overview,
            eligibility: data.eligibility,
            dates,
            locations: data.locations,
            costs: data.costs,
            contact: data.contact,
            metadata: data.metadata,
          } as InternshipType;
        });
        setMaxCost(highestCost > 0 ? highestCost : 10000);
        setCustomCostRange([0, highestCost > 0 ? highestCost : 10000]);
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
        // Reset custom cost range when unchecking Custom Range
        if (option === "Custom Range") {
          setShowCustomCostInput(false);
        }
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
    setCustomCostRange([0, maxCost]);
    setShowCustomCostInput(false);
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

    // Helper function to check if deadline is past due
    const isPastDue = (deadlines: Deadline[]): boolean => {
      const earliestDate = getEarliestDeadlineDate(deadlines);
      if (!earliestDate) return false;
      return earliestDate < new Date();
    };

    switch (sortBy) {
      case "deadline":
        return sorted.sort((a, b) => {
          const aDate = getEarliestDeadlineDate(a.dates?.deadlines || []);
          const bDate = getEarliestDeadlineDate(b.dates?.deadlines || []);

          const aPastDue = isPastDue(a.dates?.deadlines || []);
          const bPastDue = isPastDue(b.dates?.deadlines || []);

          // Past due items go to the end
          if (aPastDue && !bPastDue) return 1;
          if (!aPastDue && bPastDue) return -1;

          // Both past due or both not past due - sort by date
          if (!aDate && !bDate) return 0;
          if (!aDate) return 1;
          if (!bDate) return -1;
          return aDate.getTime() - bDate.getTime();
        });

      case "cost-low":
        return sorted.sort((a, b) => {
          const aPastDue = isPastDue(a.dates?.deadlines || []);
          const bPastDue = isPastDue(b.dates?.deadlines || []);

          // Past due items go to the end
          if (aPastDue && !bPastDue) return 1;
          if (!aPastDue && bPastDue) return -1;

          const aCost = getCostValue(a.costs);
          const bCost = getCostValue(b.costs);
          return aCost - bCost;
        });

      case "cost-high":
        return sorted.sort((a, b) => {
          const aPastDue = isPastDue(a.dates?.deadlines || []);
          const bPastDue = isPastDue(b.dates?.deadlines || []);

          // Past due items go to the end
          if (aPastDue && !bPastDue) return 1;
          if (!aPastDue && bPastDue) return -1;

          const aCost = getCostValue(a.costs);
          const bCost = getCostValue(b.costs);
          return bCost - aCost;
        });

      case "duration":
        return sorted.sort((a, b) => {
          const aPastDue = isPastDue(a.dates?.deadlines || []);
          const bPastDue = isPastDue(b.dates?.deadlines || []);

          // Past due items go to the end
          if (aPastDue && !bPastDue) return 1;
          if (!aPastDue && bPastDue) return -1;

          const aDuration = typeof a.dates?.duration_weeks === "number" ? a.dates.duration_weeks : 0;
          const bDuration = typeof b.dates?.duration_weeks === "number" ? b.dates.duration_weeks : 0;
          return aDuration - bDuration;
        });

      case "alphabetical":
        return sorted.sort((a, b) => {
          const aPastDue = isPastDue(a.dates?.deadlines || []);
          const bPastDue = isPastDue(b.dates?.deadlines || []);

          // Past due items go to the end
          if (aPastDue && !bPastDue) return 1;
          if (!aPastDue && bPastDue) return -1;

          return (a.overview?.title || '').localeCompare(b.overview?.title || '');
        });

      case "relevance":
      default:
        return sorted.sort((a, b) => {
          const aPastDue = isPastDue(a.dates?.deadlines || []);
          const bPastDue = isPastDue(b.dates?.deadlines || []);

          // Past due items go to the end
          if (aPastDue && !bPastDue) return 1;
          if (!aPastDue && bPastDue) return -1;

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
            const earliestDeadline = getEarliestDeadlineDate(deadlines);

            // If no deadline exists, include it in "Later" filter
            if (!earliestDeadline) {
              return selectedOptions.includes("Later");
            }

            const dueCategory = getDueCategory(earliestDeadline);
            return selectedOptions.includes(dueCategory);
          }

          case "New": {
            return selectedOptions.some((opt) => {
              if (opt === "New This Week") {
                const dateAdded = internship.metadata?.date_added;
                if (!dateAdded) return false;

                try {
                  const addedDate = new Date(dateAdded);
                  const now = new Date();
                  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return addedDate >= oneWeekAgo;
                } catch {
                  return false;
                }
              }
              return false;
            });
          }

          case "Subject": {
            const subjects = internship.overview?.subject || [];
            if (!Array.isArray(subjects) || subjects.length === 0) return false;

            return selectedOptions.some(selectedSubject =>
              subjects.some(internshipSubject => {
                const subjectStr = String(internshipSubject).trim().toLowerCase();
                const selectedStr = selectedSubject.trim().toLowerCase();
                // Exact match only - no partial matching
                return subjectStr === selectedStr;
              })
            );
          }

          case "Cost": {
            const costs = internship.costs?.costs || [];

            const lowestValues = costs
              .map(c => c.lowest)
              .filter(v => typeof v === "number") as number[];

            const highestValues = costs
              .map(c => c.highest)
              .filter(v => typeof v === "number") as number[];

            const minCost = lowestValues.length ? Math.min(...lowestValues) : null;
            const maxCost = highestValues.length ? Math.max(...highestValues) : null;

            const isExplicitFree = costs.some(c => c.free === true);
            const isZeroCost = minCost === 0;
            const isNoCostProvided =
              costs.length === 0 ||
              costs.every(c =>
                (c.lowest == null || c.lowest === "not provided") &&
                (c.highest == null || c.highest === "not provided")
              );

            const isFree = isExplicitFree || isZeroCost || isNoCostProvided;

            return selectedOptions.some(opt => {
              switch (opt) {
                case "Free":
                  return isFree;

                case "Under $1000":
                  return (
                    isFree ||
                    minCost !== null &&
                    maxCost !== null &&
                    minCost > 0 &&
                    maxCost < 1000
                  );

                case "$1000–$3000":
                  return (
                    !isFree &&
                    minCost !== null &&
                    maxCost !== null &&
                    minCost >= 1000 &&
                    maxCost <= 3000
                  );

                case "$3000+":
                  return (
                    !isFree &&
                    minCost !== null &&
                    minCost > 3000
                  );

                case "Custom Range": {
                  const [min, max] = customCostRange;

                  if (min === 0 && isFree) return true;

                  return (
                    !isFree &&
                    minCost !== null &&
                    maxCost !== null &&
                    minCost >= min &&
                    maxCost <= max
                  );
                }

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
                case "Rising Freshman":
                  return grades.some(grade =>
                    String(grade).toLowerCase() === "rising freshman"
                  );
                case "Rising Sophomore":
                  return grades.some(grade =>
                    String(grade).toLowerCase() === "rising sophomore"
                  );
                case "Rising Junior":
                  return grades.some(grade =>
                    String(grade).toLowerCase() === "rising junior"
                  );
                case "Rising Senior":
                  return grades.some(grade =>
                    String(grade).toLowerCase() === "rising senior"
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
    <InternshipsLoadingScreen />
  }

  return (
    <div className="min-h-screen radial-bg text-gray-800 px-4 mb-8">
      {/* Motivational Header */}
      <div className="text-center pt-6 mt-0 mb-4">
        <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <Search className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600 animate-pulse" />
          Find Your Perfect Match
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
          Find Your Perfect{' '}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient bg-300%">
            Internship
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-8 px-4 font-medium">
          {motivationalPhrase}
        </p>
      </div>

      <div className="-mt-20">
        <SearchBar
          setSearch={setSearchTerm}
          initialValue={initialSearch}
          suggestions={(() => {
            const suggestionSet = new Set<string>();
            // Add providers
            internships.forEach(i => {
              if (i.overview?.provider) suggestionSet.add(i.overview.provider);
            });

            // Add eligibility grades
            internships.forEach(i => {
              if (i.eligibility?.eligibility?.grades && Array.isArray(i.eligibility.eligibility.grades)) {
                i.eligibility.eligibility.grades.forEach(grade => {
                  if (grade && typeof grade === 'string') {
                    suggestionSet.add(grade.charAt(0).toUpperCase() + grade.slice(1));
                  }
                });
              }
            });

            // Add subjects
            internships.forEach(i => {
              if (i.overview?.subject && Array.isArray(i.overview.subject)) {
                i.overview.subject.forEach(subject => {
                  if (subject && typeof subject === 'string') {
                    suggestionSet.add(subject.charAt(0).toUpperCase() + subject.slice(1));
                  }
                });
              }
            });

            return Array.from(suggestionSet).sort();
          })()}
        />
      </div>

      {/* Sort and View Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 mt-8">
        {/* Sort Dropdown */}
        <div className="relative sort-dropdown-container">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border text-sm font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200 hover:scale-105"
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

        {/* NEW Filter Toggle */}
        <button
          onClick={() => setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters["New"]) {
              delete newFilters["New"];
            } else {
              newFilters["New"] = ["New This Week"];
            }
            return newFilters;
          })}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 ${activeFilters["New"]?.includes("New This Week")
            ? 'bg-gradient-to-r from-[#E26262] to-[#F07575] text-white border-2 border-white'
            : 'bg-white text-[#E26262] border-2 border-[#E26262] hover:bg-[#E26262] hover:text-white'
            }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          NEW!
          {activeFilters["New"]?.includes("New This Week") && (
            <span className="bg-white text-[#E26262] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {internships.filter(i => {
                const dateAdded = i.metadata?.date_added;
                if (!dateAdded) return false;
                try {
                  const addedDate = new Date(dateAdded);
                  const now = new Date();
                  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return addedDate >= oneWeekAgo;
                } catch {
                  return false;
                }
              }).length}
            </span>
          )}
        </button>

        {/* Bookmarked Only Toggle */}
        {user && hasBookmarkedInternships && (
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${showBookmarkedOnly
              ? 'bg-blue-100 text-blue-700 border border-blue-200 animate-pulse'
              : 'bg-white text-gray-700 border hover:bg-gray-50 hover:shadow-md'
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
                className={`flex items-center gap-1 px-3 py-1 ${getFilterColor(category)} rounded-full text-sm text-black animate-in fade-in-0 zoom-in-95 duration-200 hover:scale-105 transition-transform`}
              >

                <span>{category}: {option === "Custom Range" ? `$${customCostRange[0]} - $${customCostRange[1]}` : option}</span>
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
              className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
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
                  className={`filter-button flex items-center gap-2 px-4 py-2 rounded-full ${filter.color} text-black text-sm font-semibold shadow-sm hover:brightness-95 hover:scale-105 transition-all duration-200 ${hasActiveOptions ? 'ring-2 ring-blue-400 ring-offset-1' : ''
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
                  <div className="absolute top-12 left-0 w-48 bg-white rounded-xl shadow-lg p-3 space-y-2 z-20 border animate-in fade-in-0 zoom-in-95 duration-200">
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
                    {/* Subject dropdown: add search and limit display */}
                    {filter.label === "Subject" ? (
                      <>
                        <input
                          type="text"
                          value={subjectSearch}
                          onChange={e => setSubjectSearch(e.target.value)}
                          placeholder="Search subjects..."
                          className="w-full mb-2 px-2 py-1 border rounded text-sm"
                          autoFocus
                        />
                        <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                          {filter.options
                            .filter(option => option.toLowerCase().includes(subjectSearch.toLowerCase()))
                            .map(option => (
                              <label key={option} className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 p-1 rounded transition-colors cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={activeFilters[filter.label]?.includes(option) || false}
                                  onChange={() => toggleFilterOption(filter.label, option)}
                                  className="accent-blue-500 w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                                />
                                {option}
                              </label>
                            ))}
                          {filter.options.filter(option => option.toLowerCase().includes(subjectSearch.toLowerCase())).length === 0 && (
                            <div className="text-xs text-gray-400 px-2 py-1">No subjects found</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {filter.options.map(option => (
                          <div key={option}>
                            <label className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 p-1 rounded transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={activeFilters[filter.label]?.includes(option) || false}
                                onChange={() => {
                                  if (option === "Custom Range") {
                                    setShowCustomCostInput(!showCustomCostInput);
                                  }
                                  toggleFilterOption(filter.label, option);
                                }}
                                className="accent-blue-500"
                              />
                              {option}
                            </label>
                            {option === "Custom Range" && showCustomCostInput && activeFilters[filter.label]?.includes("Custom Range") && (
                              <div className="ml-0 mt-2 space-y-2 w-[180px]" onClick={(e) => e.stopPropagation()}>
                                <div className="flex flex-col gap-2 items-start w-full">
                                  <div className="flex items-center justify-start w-full mb-1 pr-1ok">
                                    <div className="flex flex-col items-start w-[80px]">
                                      <label htmlFor="minCostInput" className="text-xs text-gray-600 mb-1 ml-1">Min</label>
                                      <input
                                        id="minCostInput"
                                        type="number"
                                        min={0}
                                        max={customCostRange[1]}
                                        value={customCostRange[0]}
                                        onChange={e => {
                                          let val = Number(e.target.value);
                                          if (isNaN(val)) val = 0;
                                          if (val < 0) val = 0;
                                          if (val > customCostRange[1]) val = customCostRange[1];
                                          setCustomCostRange([val, customCostRange[1]]);
                                        }}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-400"
                                        style={{ minWidth: '60px' }}
                                      />
                                    </div>
                                    <span className="mx-1 text-gray-400 font-medium">–</span>
                                    <div className="flex flex-col items-start w-[80px]">
                                      <label htmlFor="maxCostInput" className="text-xs text-gray-600 mb-1 ml-1">Max</label>
                                      <input
                                        id="maxCostInput"
                                        type="number"
                                        min={customCostRange[0]}
                                        max={maxCost}
                                        value={customCostRange[1]}
                                        onChange={e => {
                                          let val = Number(e.target.value);
                                          if (isNaN(val)) val = customCostRange[0];
                                          if (val < customCostRange[0]) val = customCostRange[0];
                                          if (val > maxCost) val = maxCost;
                                          setCustomCostRange([customCostRange[0], val]);
                                        }}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all shadow-sm"
                                        style={{ minWidth: '60px' }}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full flex justify-center items-center">
                                    <Slider
                                      range
                                      min={0}
                                      max={maxCost}
                                      value={customCostRange}
                                      onChange={(value) => {
                                        if (Array.isArray(value)) {
                                          setCustomCostRange(value as [number, number]);
                                          setLastSearchTime(Date.now()); // Trigger immediate re-filtering
                                        }
                                      }}
                                      allowCross={false}
                                      marks={{ 0: { style: { marginLeft: 0 }, label: '$0' }, [maxCost]: { style: { marginRight: 0 }, label: `$${maxCost}` } }}
                                      step={100}
                                      trackStyle={[{ backgroundColor: '#3C66C2', height: 4 }]}
                                      handleStyle={[{ borderColor: '#3C66C2', height: 14, width: 14, marginTop: -5 }, { borderColor: '#3C66C2', height: 14, width: 14, marginTop: -5 }]}
                                      railStyle={{ height: 4 }}
                                      style={{ width: '120px', margin: '0 auto' }}
                                    />
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-6 text-center">Select range in USD</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* No Results Message */}
      {filteredAndSortedInternships.length === 0 && (
        <div className="text-center py-16 px-4">
          {/* Cat Image with animation */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <img
              src="/cat.png"
              alt="No results found"
              className="w-56 h-56 mx-auto object-contain relative z-10 animate-bounce"
              style={{ animationDuration: '3s' }}
            />
          </div>

          {/* Main heading with gradient */}
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-3">
              Oops! No internships found
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
          </div>

          {/* Contextual message with better typography */}
          <div className="max-w-lg mx-auto mb-8">
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              {showBookmarkedOnly
                ? "You haven't bookmarked any internships matching these filters yet"
                : searchTerm
                  ? `No programs found for "${searchTerm}" with your current filters`
                  : "No internships match your current filter combination"}
            </p>
          </div>

          {/* Enhanced cat's suggestion box */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 mb-8 max-w-lg mx-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-start gap-3">
              <div className="text-3xl animate-pulse">🐱</div>
              <div className="text-left">
                <p className="text-purple-800 font-bold text-lg mb-2">Meow! Here&apos;s what you can try:</p>
                <ul className="text-purple-700 text-sm space-y-2 list-none">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Remove some filters to see more options
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Try broader search terms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Check back later for new programs
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced clear button */}
          {(totalActiveFilters > 0 || searchTerm || showBookmarkedOnly) && (
            <button
              onClick={clearAllFilters}
              className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 transform"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 group-hover:animate-spin" />
                Start Fresh
              </span>
            </button>
          )}

          {/* Decorative elements */}
          <div className="mt-12 flex justify-center gap-4 opacity-30">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      )}

      <div className="animate-in fade-in-0 duration-500">
        <InternshipCards
          internships={filteredAndSortedInternships}
          bookmarked={bookmarked}
          toggleBookmark={toggleBookmark}
        />
      </div>
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