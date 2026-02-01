"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { InternshipCards as InternshipType } from "../interfaces/internshipCards";
import {
  AccessTimeOutlined as TimeIcon,
  WorkOutlineOutlined as WorkIcon,
  AttachMoneyOutlined as MoneyIcon,
  BookmarkBorder as BookmarkBorderIcon,
  BookmarkOutlined as BookmarkFilledIcon,
  SchoolOutlined as SchoolIcon,
  CalendarTodayOutlined as CalendarIcon,
  InfoOutlined as InfoIcon,
  LocationOnOutlined as LocationIcon,
  Close as CloseIcon,
  ChecklistOutlined as ChecklistIcon,
  CheckCircleOutlined as CheckCircleOutlinedIcon,
  RadioButtonUncheckedOutlined as RadioButtonUncheckedIcon,
  IosShareRounded as Share
} from "@mui/icons-material";
import { getDaysRemaining } from "../modules/getTimeRemaining";
import { getDueColorClass } from "../modules/getDueDateTextColor";
import { getIconColor } from "../modules/getDueDateIconColor";
import { formatDate } from "../modules/dateUtils";
import LaunchIcon from '@mui/icons-material/Launch';

import { auth, db } from "@/lib/config/firebaseConfig"
import { doc, getDoc } from "firebase/firestore";
import { setDoc, updateDoc } from "firebase/firestore";
import { copyLinkToUserClipboard } from "../modules/copyLinkToUserClipboard";
import { Props } from "../interfaces/InternshipProps";
import { CardPosition } from "../interfaces/CardPosition";
import { EligibilityItem, UserEligibilityData } from "../interfaces/Eligibility";
import { getAdditionalInfo } from "../modules/getAdditionalInfo";
import { isTruthyValue } from "../modules/isTruthyValue";
import { isValidValue } from "../modules/isValidValue";
import { isNewInternship } from "../modules/isNewInternship";
import { formatDuration } from "../modules/formatDuration";
import { formatLocation } from "../modules/formatLocation";

const bookmarkButtonStyles = {
  animation: "bookmarkAnimation 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
  "@keyframes bookmarkAnimation": {
    "0%": { transform: "scale(1) rotate(0deg)" },
    "35%": { transform: "scale(1.15) rotate(-8deg)" },
    "65%": { transform: "scale(1.25) rotate(5deg)" },
    "85%": { transform: "scale(1.1) rotate(-2deg)" },
    "100%": { transform: "scale(1) rotate(0deg)" },
  },
};

export default function InternshipCards({
  internships,
  bookmarked,
  toggleBookmark,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_columnCount, setColumnCount] = useState<number>(1);
  const [cardPositions, setCardPositions] = useState<{ [key: string]: CardPosition }>({});
  const [containerHeight, setContainerHeight] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isLayoutCalculated, setIsLayoutCalculated] = useState<boolean>(false);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [expandedSubjects, setExpandedSubjects] = useState<{ [key: string]: boolean }>({});
  const [modalInfo, setModalInfo] = useState<{ internshipId: string; info: { label: string; value: string }[] } | null>(null);

  // New state for eligibility checklist
  const [eligibilityModal, setEligibilityModal] = useState<{ internshipId: string; items: EligibilityItem[] } | null>(null);
  const [userEligibilityData, setUserEligibilityData] = useState<UserEligibilityData>({});

  const userId = auth.currentUser != null ? auth.currentUser.uid : null;

  const capitalizeWords = (text: string) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  

  // Function to handle opening the modal
  const handleInfoClick = (internshipId: string) => {
    const internship = internships.find(i => i.id === internshipId);
    if (internship) {
      const info = getAdditionalInfo(internship);
      setModalInfo({ internshipId, info });
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setModalInfo(null);
  };

  // Function to get eligibility items for an internship
  const getEligibilityItems = (internship: InternshipType): EligibilityItem[] => {
    const items: EligibilityItem[] = [];

    // Check application requirements
    if (isTruthyValue(internship.eligibility?.requirements?.essay_required)) {
      items.push({
        id: 'essay',
        label: 'Essay',
        required: true,
        description: 'Personal statement or essay as required by the program'
      });
    }

    if (isTruthyValue(internship.eligibility?.requirements?.recommendation_required)) {
      items.push({
        id: 'recommendation',
        label: 'Letter of Recommendation',
        required: true,
        description: 'Recommendation letter from teacher, counselor, or mentor'
      });
    }

    if (isTruthyValue(internship.eligibility?.requirements?.transcript_required)) {
      items.push({
        id: 'transcript',
        label: 'Official Transcript',
        required: true,
        description: 'Official academic transcript or grade report'
      });
    }

    // Add common application materials
    items.push({
      id: 'application_form',
      label: 'Completed Application Form',
      required: true,
      description: 'Main application form with all required fields completed'
    });

    // Add eligibility verification items
    const gradesArray = internship.eligibility?.eligibility?.grades || [];
    const validGrades = gradesArray.filter(grade => isValidValue(grade));
    if (validGrades.length > 0) {
      items.push({
        id: 'grade_eligibility',
        label: `Grade Level Verification (${validGrades.join(', ')})`,
        required: true,
        description: `Verify you are in one of the eligible grade levels: ${validGrades.join(', ')}`
      });
    }

    const ageRange = internship.eligibility?.eligibility?.age || null;
    if (isValidValue(ageRange?.minimum) || isValidValue(ageRange?.maximum)) {
      const ageText = isValidValue(ageRange?.minimum) && isValidValue(ageRange?.maximum)
        ? `${ageRange?.minimum} - ${ageRange?.maximum}`
        : isValidValue(ageRange?.minimum)
          ? `${ageRange?.minimum}+`
          : `up to ${ageRange?.maximum}`;

      items.push({
        id: 'age_eligibility',
        label: `Age Verification (Ages ${ageText})`,
        required: true,
        description: `Confirm you meet the age requirements: Ages ${ageText}`
      });
    }

    // Add additional requirements from the "other" array
    if (internship.eligibility?.requirements?.other && Array.isArray(internship.eligibility.requirements.other)) {
      internship.eligibility.requirements.other
        .filter(req => isValidValue(req))
        .forEach((req, index) => {
          items.push({
            id: `other_req_${index}`,
            label: req,
            required: true,
            description: `Additional requirement: ${req}`
          });
        });
    }

    // Add cost-related items if applicable
    if (internship.costs?.costs && Array.isArray(internship.costs.costs) && internship.costs.costs[0]) {
      const costInfo = internship.costs.costs[0];
      const hasValidCosts = isValidValue(costInfo.lowest) || isValidValue(costInfo.highest);

      if (!isTruthyValue(costInfo.free) && hasValidCosts) {
        items.push({
          id: 'payment_plan',
          label: 'Payment Plan/Financial Aid',
          required: false,
          description: 'Arrange payment or apply for financial aid if needed'
        });
      }
    }

    return items;
  };

  // Function to handle opening eligibility checklist
  const handleEligibilityClick = async (internshipId: string) => {
    const internship = internships.find(i => i.id === internshipId);
    if (internship) {
      await loadEligibilityData(internshipId); // Load saved data before opening modal
      const items = getEligibilityItems(internship);
      setEligibilityModal({ internshipId, items });
    }
  };

  // Function to close eligibility modal
  const closeEligibilityModal = () => {
    setEligibilityModal(null);
  };

  // Updated function to handle checkbox toggle and save data immediately
  const handleCheckboxToggle = (internshipId: string, itemId: string) => {
    setUserEligibilityData((prev) => {
      const updatedData = {
        ...prev,
        [internshipId]: {
          ...prev[internshipId],
          [itemId]: !prev[internshipId]?.[itemId],
        },
      };
      return updatedData;
    });
  };

  // UseEffect to save data to Firebase whenever userEligibilityData changes
  useEffect(() => {
    if (eligibilityModal) {
      saveEligibilityData(eligibilityModal.internshipId);
    }
  }, [userEligibilityData, eligibilityModal]);

  // Function to save eligibility data to database
  const saveEligibilityData = async (internshipId: string) => {
    if (!userId) {
      alert("You must be logged in to save your checklist.");
      return;
    }
    try {
      const dataToSave = {
        eligibilityChecklists: {
          [internshipId]: {
            checklist: userEligibilityData[internshipId] || {},
            lastUpdated: new Date().toISOString(),
          },
        },
      };

      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        // Merge with existing eligibilityChecklists
        const existingData = userSnapshot.data().eligibilityChecklists || {};
        await updateDoc(userDocRef, {
          eligibilityChecklists: {
            ...existingData,
            [internshipId]: dataToSave.eligibilityChecklists[internshipId],
          },
        });
      } else {
        // Create new user document
        await setDoc(userDocRef, {
          eligibilityChecklists: {
            [internshipId]: dataToSave.eligibilityChecklists[internshipId],
          },
        });
      }
    } catch (error) {
      console.error("Error saving eligibility data:", error);
      alert("Error saving checklist. Please try again.");
    }
  };

  // Function to load saved eligibility data for a specific internship
  const loadEligibilityData = async (internshipId: string) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const savedData = userSnapshot.data().eligibilityChecklists || {};
        if (savedData[internshipId]) {
          setUserEligibilityData((prev) => ({
            ...prev,
            [internshipId]: savedData[internshipId].checklist || {},
          }));
        }
      }
    } catch (error) {
      console.error("Error loading eligibility data:", error);
    }
  };

  // Configuration
  const itemWidth = 350; // Fixed width for each card
  const gap = 32; // Gap between cards

  const calculateMasonryLayout = useCallback(() => {
    if (!containerRef.current || internships.length === 0) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const availableWidth = containerRect.width;

    // Calculate how many columns can fit
    const totalItemWidth = itemWidth + gap;
    const maxColumns = Math.floor((availableWidth + gap) / totalItemWidth);
    let newColumnCount = Math.max(1, maxColumns);

    // Add minimum spacing enforcement to prevent squishing
    const actualTotalWidth = newColumnCount * itemWidth + (newColumnCount - 1) * gap;
    if (actualTotalWidth > availableWidth && newColumnCount > 1) {
      newColumnCount = Math.max(1, newColumnCount - 1);
    }

    setColumnCount(newColumnCount);

    // Calculate positions for masonry layout
    const positions: { [key: string]: CardPosition } = {};
    const columnHeights: number[] = new Array(newColumnCount).fill(0);

    // Center the columns if there's extra space
    const totalColumnsWidth = newColumnCount * itemWidth + (newColumnCount - 1) * gap;
    const startX = Math.max(0, (availableWidth - totalColumnsWidth) / 2);

    internships.forEach((internship) => {
      const internshipId = internship.id;
      const cardElement = cardRefs.current[internshipId];

      if (!cardElement) return;

      // Get the actual height of the card
      const cardHeight = cardElement.offsetHeight || 300; // fallback height

      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // Calculate position
      const x = startX + shortestColumnIndex * (itemWidth + gap);
      const y = columnHeights[shortestColumnIndex];

      positions[internshipId] = {
        x,
        y,
        height: cardHeight,
      };

      // Update column height
      columnHeights[shortestColumnIndex] += cardHeight + gap;
    });

    setCardPositions(positions);
    setContainerHeight(Math.max(...columnHeights) - gap); // Remove last gap
    setIsLayoutCalculated(true);
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, [internships, itemWidth, gap, isInitialRender]);

  // Initial layout calculation after cards are rendered
  useEffect(() => {
    // Wait for cards to be rendered and measured
    const timer = setTimeout(() => {
      calculateMasonryLayout();
    }, 100);

    return () => clearTimeout(timer);
  }, [calculateMasonryLayout]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        calculateMasonryLayout();
      }, 50);
    };

    if (typeof window !== "undefined" && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(handleResize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => resizeObserver.disconnect();
    } else {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [calculateMasonryLayout]);

  // Recalculate layout when cards change or when subjects are expanded/collapsed
  useEffect(() => {
    if (Object.keys(cardRefs.current).length === internships.length) {
      calculateMasonryLayout();
    }
  }, [internships.length, expandedSubjects, calculateMasonryLayout]);

  // Close modals when clicking escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modalInfo) {
          closeModal();
        }
        if (eligibilityModal) {
          closeEligibilityModal();
        }
      }
    };

    if (modalInfo || eligibilityModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [modalInfo, eligibilityModal]);

  return (
    <>
      <div className="px-0 sm:px-4 lg:px-8">
        <div
          ref={containerRef}
          className="mt-10 relative"
          style={{
            height: `${containerHeight}px`,
            transition: "height 0.3s ease-out",
            minWidth: "382px", // itemWidth + gap to prevent squishing
          }}
        >
          {internships.map((internship) => {
            const internshipId = internship.id;

            // Safely get first deadline date or null
            const firstDeadlineDateString = internship.dates?.deadlines?.[0]?.date ?? null;
            // Debug: log raw date string to console
            if (firstDeadlineDateString) {
              console.log('Raw deadline date:', firstDeadlineDateString);
            }
            const firstDeadlineDate = firstDeadlineDateString &&
              isValidValue(firstDeadlineDateString)
              ? formatDate(firstDeadlineDateString)
              : null;

            // For daysRemaining, use robust parsing (now supported in getDaysRemaining)
            const daysRemaining = getDaysRemaining(firstDeadlineDateString);
            const dueTextClass = getDueColorClass(daysRemaining);
            const iconColor = getIconColor(daysRemaining);
            const position = cardPositions[internshipId];
            // Check if internship is new (added in last week)
            const isNew = isNewInternship(internship.metadata?.date_added);
            console.log('🔍 Internship:', internship.overview?.title);
            console.log('   metadata:', internship.metadata);
            console.log('   isNew result:', isNew);

            // Eligibility: grades and age display
            const gradesArray = internship.eligibility?.eligibility?.grades || [];
            const validGrades = gradesArray.filter(grade => isValidValue(grade));
            const ageRange = internship.eligibility?.eligibility?.age || null;

            // Duration from dates.duration_weeks
            const duration = internship.dates?.duration_weeks;
            const formattedDuration = formatDuration(duration);

            // Location information
            const locationInfo = formatLocation(internship);

            return (
              <div
                key={internshipId}
                ref={(el) => {
                  cardRefs.current[internshipId] = el;
                }}
                className="absolute w-[350px] bg-white rounded-[30px] px-[32px] py-[42px] shadow-lg border-2 border-black/30 flex flex-col hover:shadow-xl transition-all duration-300"
                style={{
                  left: position ? `${position.x}px` : "0px",
                  top: position ? `${position.y}px` : "0px",
                  transform: position ? "translate3d(0, 0, 0)" : "translate3d(0, 0, 0)",
                  opacity: isInitialRender ? 0 : (daysRemaining !== null && daysRemaining < 0 ? 0.6 : 1),
                  transition: isInitialRender ? "opacity 0.3s ease-out" : "all 0.3s ease-out",
                  width: `${itemWidth}px`,
                }}
                id={internship.id}
              >
                {/* NEW Badge - Top Left */}
                {isNew && (
                  <div className="absolute -top-3 left-4 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10" style={{ backgroundColor: '#E26262' }}>
                    NEW!
                  </div>
                )}

                {/* Top Right Icons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {/* Share Button */}
                  <button
                    onClick={() => copyLinkToUserClipboard(internship.id)}
                    className="text-[#8D8DAC] hover:text-[#2F2F3A] cursor-pointer p-2 rounded-full hover:bg-black/5 transition-all duration-200"
                    aria-label={`Share ${internship.overview?.title || 'this internship'} with friends`}
                  >
                    <Share fontSize="small"/>
                  </button>
                  {/* Checklist */}
                  <button
                    onClick={() => handleEligibilityClick(internshipId)}
                    className="text-[#8D8DAC] hover:text-[#2F2F3A] cursor-pointer p-2 rounded-full hover:bg-black/5 transition-all duration-200"
                    aria-label={`Eligibility checklist for ${internship.overview?.title || 'this internship'}`}
                  >
                    <ChecklistIcon fontSize="small" />
                  </button>
                  {/* Information Card */}
                  <button
                    onClick={() => handleInfoClick(internshipId)}
                    className="text-[#8D8DAC] hover:text-[#2F2F3A] cursor-pointer p-2 rounded-full hover:bg-black/5 transition-all duration-200"
                    aria-label={`More information about ${internship.overview?.title || 'this internship'}`}
                  >
                    <InfoIcon fontSize="small" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#8D8DAC] pb-2">
                    {internship.overview?.provider}
                  </h3>
                  <h2 className="text-[2.5rem] leading-[45px] font-regular capitalize bg-gradient-to-t from-[#2F2F3A] to-[#5F5F74] bg-clip-text text-transparent pb-2 break-words">
                    {internship.overview?.title || 'none'}
                  </h2>
                  {firstDeadlineDate && (
                    <p className={`text-base font-medium flex items-center text-[1.2rem] ${dueTextClass}`}>
                      <TimeIcon className="mr-2" sx={{ color: iconColor, fontSize: 26 }} />
                      <span className="font-bold">Due: </span>
                      <span className="ml-1">
                        {firstDeadlineDate}
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-y-[6px]">
                  {Array.isArray(internship.overview?.subject) &&
                    internship.overview.subject.length > 0 &&
                    internship.overview.subject.some(subj => isValidValue(subj)) && (
                      <div className="text-base flex items-start text-[1.2rem] text-[#3C66C2]">
                        <WorkIcon className="mr-2 mt-[6px]" fontSize="small" />
                        <div className="flex flex-wrap gap-2">
                          {(expandedSubjects[internshipId]
                            ? internship.overview.subject.filter(subj => isValidValue(subj))
                            : internship.overview.subject.filter(subj => isValidValue(subj)).slice(0, 3)
                          ).map((subj, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                            >
                              {capitalizeWords(subj)}
                            </span>
                          ))}

                          {internship.overview.subject.filter(subj => isValidValue(subj)).length > 3 && (
                            <button
                              onClick={() =>
                                setExpandedSubjects((prev) => ({
                                  ...prev,
                                  [internshipId]: !prev[internshipId]
                                }))
                              }
                              className="bg-blue-200 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-300 transition"
                            >
                              {expandedSubjects[internshipId] ? "➤ Show less" : "➤ View all"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  {(validGrades.length > 0 || isValidValue(ageRange?.minimum) || isValidValue(ageRange?.maximum)) && (
                    <p className="text-base flex items-center text-[1.2rem] text-[#E66646]">
                      <SchoolIcon className="mr-2" fontSize="small" />
                      <span>
                        {validGrades.length > 0 && (
                          <>
                            {validGrades.map((g) => g.charAt(0).toUpperCase() + g.slice(1)).join(", ")}
                            {(isValidValue(ageRange?.minimum) || isValidValue(ageRange?.maximum)) && <br />}
                          </>
                        )}
                        {(isValidValue(ageRange?.minimum) || isValidValue(ageRange?.maximum)) && (
                          <>
                            {isValidValue(ageRange?.minimum) && isValidValue(ageRange?.maximum)
                              ? `Ages ${ageRange?.minimum} - ${ageRange?.maximum}`
                              : isValidValue(ageRange?.minimum)
                                ? `Ages ${ageRange?.minimum}+`
                                : `Ages up to ${ageRange?.maximum}`}
                          </>
                        )}
                      </span>
                    </p>
                  )}

                  {formattedDuration !== "Not provided" && (
                    <p className="text-base flex items-center text-[1.2rem] text-[#9B59B6]">
                      <CalendarIcon className="mr-2" fontSize="small" />
                      <span>
                        Duration: {formattedDuration}
                      </span>
                    </p>
                  )}

                  {locationInfo !== "Location not provided" && (
                    <p className="text-base flex items-center text-[1.2rem]" style={{ color: '#fcba03' }}>
                      <LocationIcon className="mr-2" fontSize="small" />
                      <span>
                        {locationInfo}
                      </span>
                    </p>
                  )}

                  {/* Cost/Stipend logic: show stipend if free and stipend exists; else show cost first, stipend next line if both; else show only one; else show nothing */}
                  {(() => {
                    const hasCost = internship.costs?.costs && Array.isArray(internship.costs.costs) && internship.costs.costs[0];
                    const hasStipend = isTruthyValue(internship.costs?.stipend?.available) && isValidValue(internship.costs?.stipend?.amount);
                    let costStr = "";

                    if (hasCost) {
                      const costInfo = internship.costs.costs[0];
                      const hasValidCosts = isValidValue(costInfo.lowest) || isValidValue(costInfo.highest);

                      if (isTruthyValue(costInfo.free) || !hasValidCosts) {
                        costStr = "Free";
                      } else {
                        const costParts = [];
                        if (isValidValue(costInfo.lowest) && isValidValue(costInfo.highest)) {
                          if (costInfo.lowest === costInfo.highest) {
                            costParts.push(`${costInfo.lowest}`);
                          } else {
                            costParts.push(`${costInfo.lowest} - ${costInfo.highest}`);
                          }
                        } else if (isValidValue(costInfo.lowest)) {
                          costParts.push(`Starting at ${costInfo.lowest}`);
                        } else if (isValidValue(costInfo.highest)) {
                          costParts.push(`Up to ${costInfo.highest}`);
                        }
                        if (costParts.length > 0) {
                          costStr = costParts.join(", ");
                        }
                      }
                      if (isTruthyValue(costInfo["financial-aid-available"])) {
                        costStr += (costStr ? " • " : "") + "Financial aid available";
                      }
                    }

                    if (hasCost && isTruthyValue(internship.costs?.costs[0]?.free) && hasStipend) {
                      // If the internship is free and has a stipend, only show the stipend
                      return (
                        <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                          <MoneyIcon className="mr-2" fontSize="small" />
                          <span>Stipend: ${internship.costs.stipend.amount}</span>
                        </p>
                      );
                    } else if (hasCost && hasStipend) {
                      return (
                        <>
                          <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                            <MoneyIcon className="mr-2" fontSize="small" />
                            <span>{costStr}</span>
                          </p>
                          <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                            <MoneyIcon className="mr-2" fontSize="small" />
                            <span>Stipend: ${internship.costs.stipend.amount}</span>
                          </p>
                        </>
                      );
                    } else if (hasCost && costStr) {
                      return (
                        <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                          <MoneyIcon className="mr-2" fontSize="small" />
                          <span>{costStr}</span>
                        </p>
                      );
                    } else if (hasStipend) {
                      return (
                        <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                          <MoneyIcon className="mr-2" fontSize="small" />
                          <span>Stipend: ${internship.costs.stipend.amount}</span>
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={
                      !internship.overview?.link
                        ? "/pages/report"
                        : internship.overview.link.startsWith("http")
                          ? internship.overview.link
                          : `https://${internship.overview.link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A90E2] hover:text-[#ffffff] hover:bg-[#4A90E2] p-2 rounded-full transition-all duration-200 cursor-pointer"
                    aria-label={`Visit ${internship.overview?.title || 'website'} website`}
                  >
                    <LaunchIcon fontSize="medium" />
                  </a>
                  <button
                    onClick={() => toggleBookmark(internshipId)}
                    className="text-[#8D8DAC] hover:text-[#2F2F3A] cursor-pointer p-1 rounded-full hover:bg-black/5 active:bg-black/10 transition-all duration-200"
                    aria-label={`${bookmarked[internshipId] ? "Remove" : "Add"} bookmark for ${internship.overview?.title || 'this internship'}`}
                  >
                    {bookmarked[internshipId] ? (
                      <BookmarkFilledIcon
                        fontSize="medium"
                        className="text-[#2F2F3A]"
                        sx={{
                          ...bookmarkButtonStyles,
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                        }}
                      />
                    ) : (
                      <BookmarkBorderIcon
                        fontSize="medium"
                        sx={{
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Modal */}
      {modalInfo && (
        <div
          className="fixed top-0 left-0 w-full h-screen backdrop-blur-sm bg-black/10 z-[9999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {internships.find(i => i.id === modalInfo.internshipId)?.overview?.title || 'Internship Details'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <CloseIcon fontSize="medium" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {modalInfo.info.length > 0 ? (
                <div className="space-y-4">
                  {modalInfo.info.map((info, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="font-semibold text-gray-800 mb-2 text-lg">{info.label}:</div>
                      <div className="text-gray-700 leading-relaxed">{info.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No additional information available for this internship.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Checklist Modal */}
      {eligibilityModal && (
        <div
          className="fixed top-0 left-0 w-full h-screen backdrop-blur-sm bg-black/10 z-[9999] flex items-center justify-center p-4"
          onClick={closeEligibilityModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Eligibility Checklist
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {internships.find(i => i.id === eligibilityModal.internshipId)?.overview?.title || 'Internship'}
                  </p>
                </div>
                <button
                  onClick={closeEligibilityModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close checklist"
                >
                  <CloseIcon fontSize="medium" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {eligibilityModal.items.length > 0 ? (
                <div className="space-y-4">
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      Check off items as you complete them. Your progress will be saved automatically.
                    </p>
                  </div>

                  {eligibilityModal.items.map((item) => {
                    const isChecked = userEligibilityData[eligibilityModal.internshipId]?.[item.id] || false;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleCheckboxToggle(eligibilityModal.internshipId, item.id)}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-blue-600">
                            {isChecked ? (
                              <CheckCircleOutlinedIcon className="text-green-600" />
                            ) : (
                              <RadioButtonUncheckedIcon />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium ${isChecked ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                                {item.label}
                              </h3>
                              {item.required && (
                                <span className="text-red-500 text-xs bg-red-100 px-2 py-1 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className={`text-sm ${isChecked ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  { }
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {Object.values(userEligibilityData[eligibilityModal.internshipId] || {}).filter(Boolean).length} of {eligibilityModal.items.length} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(Object.values(userEligibilityData[eligibilityModal.internshipId] || {}).filter(Boolean).length / eligibilityModal.items.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No specific eligibility requirements found for this internship.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}