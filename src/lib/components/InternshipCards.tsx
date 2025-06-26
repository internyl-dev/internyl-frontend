"use client";

import { useState } from "react";
import { sampleInternshipData } from "../test/sample";

import { getDaysRemaining } from "../modules/getTimeRemaining";
import { getDueColorClass } from "../modules/getDueDateTextColor";
import { getIconColor } from "../modules/getDueDateIconColor";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

export default function InternshipCards() {
  const userSignedIn = true; // <-- Replace with your actual auth logic
  const [bookmarked, setBookmarked] = useState<{ [key: number]: boolean }>({});

  const toggleBookmark = (idx: number) => {
    if (!userSignedIn) return;
    setBookmarked((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 px-4 mt-10" style={{ columnGap: "20px" }}>
      {sampleInternshipData.map((internship, idx) => {
        const daysRemaining = getDaysRemaining(internship.deadlines[0]?.date ?? null);
        const dueTextClass = getDueColorClass(daysRemaining);
        const iconColor = getIconColor(daysRemaining);

        return (
          <div
            key={idx}
            className="bg-white rounded-[30px] px-[32px] py-[42px] shadow-md mb-5 break-inside-avoid"
            style={{ width: "350px", display: "inline-block" }}
          >
            {/* Top */}
            <div>
              <h3 className="text-sm font-semibold text-[#8D8DAC] pb-2">{internship.provider}</h3>
              <h2 className="text-[2.5rem] leading-[45px] font-regular capitalize bg-gradient-to-t from-[#2F2F3A] to-[#5F5F74] bg-clip-text text-transparent pb-2 break-words">
                {internship.title}
              </h2>
              <p className={`text-base font-medium flex items-center text-[1.2rem] ${dueTextClass}`}>
                <AccessTimeOutlinedIcon className="mr-2" sx={{ color: iconColor, fontSize: 26 }} />
                <span className="font-bold">Due: </span>
                <span className="ml-1">
                  {internship.deadlines[0]?.date
                    ? internship.deadlines[0].date.toLocaleDateString()
                    : "Date not provided"}
                </span>
              </p>
            </div>

            {/* Middle */}
            <div className="mt-4 flex flex-col gap-y-[6px]">
              <p className="text-base flex items-center text-[1.2rem] text-[#3C66C2]">
                <WorkOutlineOutlinedIcon className="mr-2" fontSize="small" />
                <span>{internship.subject}</span>
              </p>
              <p className="text-base flex items-center text-[1.2rem] text-[#E66646]">
                <SchoolOutlinedIcon className="mr-2" fontSize="small" />
                <span>
                  {internship.eligibility.rising ? "Rising " : ""}
                  {internship.eligibility.grades
                    .map((grade) => grade.charAt(0).toUpperCase() + grade.slice(1))
                    .join(", ")}
                </span>
              </p>
              <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                <AttachMoneyOutlinedIcon className="mr-2" fontSize="small" />
                <span>
                  {internship.stipend.available ? `$${internship.stipend.amount}` : "Free"}
                </span>
              </p>
            </div>

            {/* Bookmark Icon */}
            <div className="mt-4 text-right">
              <button onClick={() => toggleBookmark(idx)}>
                {bookmarked[idx] ? (
                  <BookmarkOutlinedIcon fontSize="medium" />
                ) : (
                  <BookmarkBorderIcon fontSize="medium" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
