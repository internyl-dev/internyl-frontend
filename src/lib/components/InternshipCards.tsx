"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { InternshipCards as InternshipType } from "../types/internshipCards";
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
} from "@mui/icons-material";
import { getDaysRemaining } from "../modules/getTimeRemaining";
import { getDueColorClass } from "../modules/getDueDateTextColor";
import { getIconColor } from "../modules/getDueDateIconColor";
import { formatDate } from "../modules/dateUtils";
import LaunchIcon from '@mui/icons-material/Launch';

interface Props {
  internships: InternshipType[];
  bookmarked: { [key: string]: boolean };
  toggleBookmark: (internshipId: string) => void;
}

interface CardPosition {
  x: number;
  y: number;
  height: number;
}

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

  const capitalizeWords = (text: string) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Function to format duration
  const formatDuration = (duration: string | number | null | undefined): string => {
    if (duration === null || duration === undefined || duration === "not provided" || duration === "") {
      return "Not provided";
    }
    
    // If it's a number (integer), add "weeks"
    if (typeof duration === 'number' || (typeof duration === 'string' && !isNaN(Number(duration)))) {
      const weeks = typeof duration === 'number' ? duration : Number(duration);
      return `${weeks} weeks`;
    }
    
    // If it's already a string with descriptive text, return as is
    if (typeof duration === 'string') {
      return duration;
    }
    
    return "Not provided";
  };

  // Helper function to check if value is valid (not "not provided", null, undefined, or empty)
  const isValidValue = (value: string | number | boolean | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
      return value.trim() !== "" && value !== "not provided";
    }
    if (typeof value === 'number') return true;
    if (typeof value === 'boolean') return true;
    return false;
  };

  // Helper function to check if value is truthy (for yes/no fields)
  const isTruthyValue = (value: string | number | boolean | null | undefined): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      return lower === 'yes' || lower === 'true' || lower === '1';
    }
    return false;
  };

  // Function to format location information
  const formatLocation = (internship: InternshipType): string => {
    if (internship.locations?.locations && Array.isArray(internship.locations.locations)) {
      const location = internship.locations.locations[0];
      if (location) {
        const locationParts = [];

        // Add physical location parts first
        if (isValidValue(location.city)) {
          locationParts.push(location.city);
        }
        if (isValidValue(location.state)) {
          locationParts.push(location.state);
        }
        if (isValidValue(location.address)) {
          locationParts.push(location.address);
        }

        // Handle virtual field
        if (isValidValue(location.virtual)) {
          // If there's already a physical location, don't override it
          if (locationParts.length === 0) {
            const virtualValue = location.virtual.toString().toLowerCase();
            if (virtualValue === 'true' || virtualValue === 'yes') {
              locationParts.push("Virtual");
            } else if (virtualValue === 'false' || virtualValue === 'no') {
              locationParts.push("In person");
            } else if (virtualValue === 'both available' || virtualValue === 'hybrid') {
              locationParts.push("Virtual & In person");
            } else {
              locationParts.push(`Virtual: ${location.virtual}`);
            }
          }
        }

        if (locationParts.length > 0) {
          return locationParts.join(", ");
        }
      }
    }
    return "Location not provided";
  };

  // Function to get additional info not displayed on card
  const getAdditionalInfo = (internship: InternshipType) => {
    const info: { label: string; value: string }[] = [];

  // Description - most important, shown first
    if (isValidValue(internship.overview?.description)) {
      info.push({
        label: "Description",
        value: internship.overview.description
      });
    }
    
    // Location information
    if (internship.locations?.locations && Array.isArray(internship.locations.locations)) {
      const location = internship.locations.locations[0];
      if (location) {
        const locationParts = [];
        if (isValidValue(location.city)) {
          locationParts.push(location.city);
        }
        if (isValidValue(location.state)) {
          locationParts.push(location.state);
        }
        if (isValidValue(location.virtual)) {
          locationParts.push(`Virtual: ${location.virtual}`);
        }
        if (isValidValue(location.address)) {
          locationParts.push(location.address);
        }
        
        if (locationParts.length > 0) {
          info.push({
            label: "Location",
            value: locationParts.join(", ")
          });
        }
      }
    }
    
    // Tags (online, hybrid, in-person)
    if (internship.overview?.tags && Array.isArray(internship.overview.tags)) {
      const validTags = internship.overview.tags.filter(tag => isValidValue(tag));
      if (validTags.length > 0) {
        info.push({
          label: "Format",
          value: validTags.map(tag => capitalizeWords(tag)).join(", ")
        });
      }
    }
    
    // All deadlines with details
    if (internship.dates?.deadlines && Array.isArray(internship.dates.deadlines)) {
      const deadlines = internship.dates.deadlines
        .filter(deadline => isValidValue(deadline.name))
        .map(deadline => {
          let deadlineStr = deadline.name;
          if (isValidValue(deadline.date)) {
            deadlineStr += `: ${formatDate(deadline.date)}`;
          }
          if (isValidValue(deadline.priority)) {
            deadlineStr += ` (${deadline.priority} priority)`;
          }
          if (isValidValue(deadline.term)) {
            deadlineStr += ` - ${deadline.term}`;
          }
          return deadlineStr;
        });
      if (deadlines.length > 0) {
        info.push({
          label: deadlines.length === 1 ? "Deadline" : "Deadlines",
          value: deadlines.join(" • ")
        });
      }
    }
    
    // Program dates
    if (internship.dates?.dates && Array.isArray(internship.dates.dates)) {
      const programDates = internship.dates.dates
        .filter(dateItem => isValidValue(dateItem.term))
        .map(dateItem => {
          let dateStr = dateItem.term;
          if (isValidValue(dateItem.start) && isValidValue(dateItem.end)) {
            const startDate = formatDate(dateItem.start);
            const endDate = formatDate(dateItem.end);
            dateStr += `: ${startDate} - ${endDate}`;
          }
          return dateStr;
        });
      if (programDates.length > 0) {
        info.push({
          label: "Program Dates",
          value: programDates.join(" • ")
        });
      }
    }
    
    // Eligibility requirements from "other" array
    if (internship.eligibility?.requirements?.other && Array.isArray(internship.eligibility.requirements.other)) {
      const requirements = internship.eligibility.requirements.other
        .filter(req => isValidValue(req));
      if (requirements.length > 0) {
        info.push({
          label: "Requirements",
          value: requirements.join(" • ")
        });
      }
    }
    
    // Application requirements
    const appRequirements = [];
    if (isTruthyValue(internship.eligibility?.requirements?.essay_required)) {
      appRequirements.push("Essay required");
    }
    if (isTruthyValue(internship.eligibility?.requirements?.recommendation_required)) {
      appRequirements.push("Recommendation required");
    }
    if (isTruthyValue(internship.eligibility?.requirements?.transcript_required)) {
      appRequirements.push("Transcript required");
    }
    
    if (appRequirements.length > 0) {
      info.push({
        label: "Application Requirements",
        value: appRequirements.join(" • ")
      });
    }
    
    // Cost details
    if (internship.costs?.costs && Array.isArray(internship.costs.costs)) {
      const costInfo = internship.costs.costs[0];
      if (costInfo) {
        let costStr = "";
        if (isTruthyValue(costInfo.free)) {
          costStr = "Free program";
        } else {
          const costParts = [];
          if (isValidValue(costInfo.lowest) && isValidValue(costInfo.highest)) {
            costParts.push(`$${costInfo.lowest} - $${costInfo.highest}`);
          } else if (isValidValue(costInfo.lowest)) {
            costParts.push(`Starting at $${costInfo.lowest}`);
          } else if (isValidValue(costInfo.highest)) {
            costParts.push(`Up to $${costInfo.highest}`);
          }
          
          if (costParts.length > 0) {
            costStr = costParts.join(", ");
          }
        }
        
        if (isTruthyValue(costInfo["financial-aid-available"])) {
          costStr += (costStr ? " • " : "") + "Financial aid available";
        }
        
        if (costStr) {
          info.push({
            label: "Program Cost",
            value: costStr
          });
        }
      }
    }
    
    // Contact information
    if (internship.contact?.contact) {
      const contactInfo = [];
      if (isValidValue(internship.contact.contact.email)) {
        contactInfo.push(`Email: ${internship.contact.contact.email}`);
      }
      if (isValidValue(internship.contact.contact.phone)) {
        contactInfo.push(`Phone: ${internship.contact.contact.phone}`);
      }
      
      if (contactInfo.length > 0) {
        info.push({
          label: "Contact",
          value: contactInfo.join(" • ")
        });
      }
    }
    
    return info;
  };

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

  // Close modal when clicking escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalInfo) {
        closeModal();
      }
    };

    if (modalInfo) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalInfo]);

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
            const firstDeadlineDate = firstDeadlineDateString && 
              isValidValue(firstDeadlineDateString)
                ? (() => {
                    try {
                      return new Date(firstDeadlineDateString);
                    } catch {
                      return null;
                    }
                  })()
                : null;

            const daysRemaining = getDaysRemaining(firstDeadlineDate);
            const dueTextClass = getDueColorClass(daysRemaining);
            const iconColor = getIconColor(daysRemaining);
            const position = cardPositions[internshipId];

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
                className="absolute w-[350px] bg-white rounded-[30px] px-[32px] py-[42px] shadow-lg border border-black/30 flex flex-col hover:shadow-xl transition-all duration-300"
                style={{
                  left: position ? `${position.x}px` : "0px",
                  top: position ? `${position.y}px` : "0px",
                  transform: position ? "translate3d(0, 0, 0)" : "translate3d(0, 0, 0)",
                  opacity: isInitialRender ? 0 : 1,
                  transition: isInitialRender ? "opacity 0.3s ease-out" : "all 0.3s ease-out",
                  width: `${itemWidth}px`,
                }}
              >
                {/* Info Icon - Top Right */}
                <div className="absolute top-4 right-4">
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
                        {firstDeadlineDate.toLocaleDateString()}
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

                    {/* Cost/Stipend logic: show cost first, stipend next line if both; else show only one; else show nothing */}
                    {(() => {
                      const hasCost = internship.costs?.costs && Array.isArray(internship.costs.costs) && internship.costs.costs[0];
                      const hasStipend = isTruthyValue(internship.costs?.stipend?.available) && isValidValue(internship.costs?.stipend?.amount);
                      let costStr = "";
                      if (hasCost) {
                        const costInfo = internship.costs.costs[0];
                        if (isTruthyValue(costInfo.free)) {
                          costStr = "Free program";
                        } else {
                          const costParts = [];
                          if (isValidValue(costInfo.lowest) && isValidValue(costInfo.highest)) {
                            costParts.push(`$${costInfo.lowest} - $${costInfo.highest}`);
                          } else if (isValidValue(costInfo.lowest)) {
                            costParts.push(`Starting at $${costInfo.lowest}`);
                          } else if (isValidValue(costInfo.highest)) {
                            costParts.push(`Up to $${costInfo.highest}`);
                          }
                          if (costParts.length > 0) {
                            costStr = costParts.join(", ");
                          }
                        }
                        if (isTruthyValue(costInfo["financial-aid-available"])) {
                          costStr += (costStr ? " • " : "") + "Financial aid available";
                        }
                      }
                      if (hasCost && hasStipend) {
                        return <>
                          <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                            <MoneyIcon className="mr-2" fontSize="small" />
                            <span>{costStr}</span>
                          </p>
                          <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                            <MoneyIcon className="mr-2" fontSize="small" />
                            <span>Stipend: ${internship.costs.stipend.amount}</span>
                          </p>
                        </>;
                      } else if (hasCost) {
                        return costStr ? (
                          <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                            <MoneyIcon className="mr-2" fontSize="small" />
                            <span>{costStr}</span>
                          </p>
                        ) : null;
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

      {/* Modal Overlay */}
      {modalInfo && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/10 z-[9999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
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
    </>
  );
}