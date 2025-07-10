"use client";

import React from "react";
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

interface Props {
  internships: InternshipType[];
  bookmarked: { [key: string]: boolean };
  toggleBookmark: (internshipId: string) => void;
}

export default function InternshipCards({
  internships,
  bookmarked,
  toggleBookmark,
}: Props) {
  return (
    <div className="px-6 sm:px-12 lg:px-20">
      <div
        className="mt-10 gap-8 [column-width:350px] columns-auto"
        style={{ columnGap: "2rem" }}
      >
        {internships.map((internship) => {
          const internshipId = internship.id;
          const daysRemaining = getDaysRemaining(
            internship.deadlines[0]?.date ?? null
          );
          const dueTextClass = getDueColorClass(daysRemaining);
          const iconColor = getIconColor(daysRemaining);

          return (
            <div
              key={internshipId}
              className="break-inside-avoid mb-8 w-[350px] bg-white rounded-[30px] px-[32px] py-[42px] shadow-lg border border-black/30 flex flex-col"
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

              <div className="mt-4 text-right">
                <button
                  onClick={() => toggleBookmark(internshipId)}
                  className="text-[#8D8DAC] hover:text-[#2F2F3A] transition-colors cursor-pointer"
                >
                  {bookmarked[internshipId] ? (
                    <BookmarkFilledIcon
                      fontSize="medium"
                      className="text-[#2F2F3A]"
                    />
                  ) : (
                    <BookmarkBorderIcon fontSize="medium" />
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
