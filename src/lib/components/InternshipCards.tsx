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
} from "@mui/icons-material";
import { getDaysRemaining } from "../modules/getTimeRemaining";
import { getDueColorClass } from "../modules/getDueDateTextColor";
import { getIconColor } from "../modules/getDueDateIconColor";
import { Button } from "@mui/material";

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
  const [columnCount, setColumnCount] = useState<number>(1);
  const [cardPositions, setCardPositions] = useState<{ [key: string]: CardPosition }>({});
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isLayoutCalculated, setIsLayoutCalculated] = useState<boolean>(false);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

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

    internships.forEach((internship, index) => {
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
        height: cardHeight
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
  }, [internships, itemWidth, gap]);

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
      // Don't hide cards on resize, just recalculate
      setTimeout(() => {
        calculateMasonryLayout();
      }, 50); // Reduced delay
    };

    // Use ResizeObserver for better performance if available
    if (typeof window !== "undefined" && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(handleResize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => resizeObserver.disconnect();
    } else {
      // Fallback to window resize event
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [calculateMasonryLayout]);

  // Recalculate layout when cards change
  useEffect(() => {
    if (Object.keys(cardRefs.current).length === internships.length) {
      calculateMasonryLayout();
    }
  }, [internships.length, calculateMasonryLayout]);

  return (
    <div className="px-0 sm:px-4 lg:px-8">
      <div
        ref={containerRef}
        className="mt-10 relative"
        style={{
          height: `${containerHeight}px`,
          transition: 'height 0.3s ease-out',
          minWidth: '382px', // itemWidth + gap to prevent squishing
          // overflowX: 'auto' // Allow horizontal scroll if needed
        }}
      >
        {internships.map((internship) => {
          const internshipId = internship.id;
          const daysRemaining = getDaysRemaining(
            internship.deadlines[0]?.date ?? null
          );
          const dueTextClass = getDueColorClass(daysRemaining);
          const iconColor = getIconColor(daysRemaining);
          const position = cardPositions[internshipId];

          return (
            <div
              key={internshipId}
              ref={(el) => {
                cardRefs.current[internshipId] = el;
              }}
              className="absolute w-[350px] bg-white rounded-[30px] px-[32px] py-[42px] shadow-lg border border-black/30 flex flex-col hover:shadow-xl transition-all duration-300"
              style={{
                left: position ? `${position.x}px` : '0px',
                top: position ? `${position.y}px` : '0px',
                transform: position ? 'translate3d(0, 0, 0)' : 'translate3d(0, 0, 0)',
                opacity: isInitialRender ? 0 : 1, // Only hide on initial render
                transition: isInitialRender ? 'opacity 0.3s ease-out' : 'all 0.3s ease-out',
                width: `${itemWidth}px`,
                zIndex: 1
              }}
            >
              <div>
                <h3 className="text-sm font-semibold text-[#8D8DAC] pb-2">
                  {internship.provider}
                </h3>
                <h2 className="text-[2.5rem] leading-[45px] font-regular capitalize bg-gradient-to-t from-[#2F2F3A] to-[#5F5F74] bg-clip-text text-transparent pb-2 break-words">
                  {internship.title}
                </h2>
                <p
                  className={`text-base font-medium flex items-center text-[1.2rem] ${dueTextClass}`}
                >
                  <TimeIcon
                    className="mr-2"
                    sx={{ color: iconColor, fontSize: 26 }}
                  />
                  <span className="font-bold">Due: </span>
                  <span className="ml-1">
                    {typeof window !== "undefined" &&
                      internship.deadlines[0]?.date
                      ? internship.deadlines[0].date.toLocaleDateString()
                      : internship.deadlines[0]?.date?.toString() ||
                      "Date not provided"}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-y-[6px]">
                <p className="text-base flex items-center text-[1.2rem] text-[#3C66C2]">
                  <WorkIcon className="mr-2" fontSize="small" />
                  <span>{internship.subject}</span>
                </p>
                <p className="text-base flex items-center text-[1.2rem] text-[#E66646]">
                  <SchoolIcon className="mr-2" fontSize="small" />
                  <span>
                    {internship.eligibility?.rising ? "Rising " : ""}
                    {internship.eligibility?.grades
                      ?.map(
                        (grade) =>
                          grade.charAt(0).toUpperCase() + grade.slice(1)
                      )
                      .join(", ")}
                  </span>
                </p>

                <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                  <MoneyIcon className="mr-2" fontSize="small" />
                  <span>
                    {internship.stipend?.available &&
                      internship.stipend.amount !== null
                      ? `$${internship.stipend.amount}`
                      : "Free"}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Button
                  variant="outlined"
                  href={
                    !internship.link
                      ? "/pages/report"
                      : internship.link.startsWith("http")
                        ? internship.link
                        : `https://${internship.link}`
                  }
                  sx={{ borderColor: '#ec6464', color: 'black', '&:hover': { borderColor: '#d55555', backgroundColor: '#f8dada' } }}
                >Visit Website</Button>
                <button
                  onClick={() => toggleBookmark(internshipId)}
                  className="text-[#8D8DAC] hover:text-[#2F2F3A] cursor-pointer p-1 rounded-full hover:bg-black/5 active:bg-black/10 transition-all duration-200"
                  aria-label={`${bookmarked[internshipId] ? 'Remove' : 'Add'} bookmark for ${internship.title}`}
                >
                  {bookmarked[internshipId] ? (
                    <BookmarkFilledIcon
                      fontSize="medium"
                      className="text-[#2F2F3A]"
                      sx={{ 
                        ...bookmarkButtonStyles,
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
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
  );
}