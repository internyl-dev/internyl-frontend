import { sampleInternshipData } from "../test/sample";

import { getDaysRemaining } from "../modules/getTimeRemaining";
import { getDueColorClass } from "../modules/getDueDateTextColor";
import { getIconColor } from "../modules/getDueDateIconColor";

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

export default function InternshipCards() {
  return (
    <div className="flex flex-wrap justify-center items-start gap-8 mt-10">
      {sampleInternshipData.map((internship, idx) => {
        const daysRemaining = getDaysRemaining(internship.deadlines[0]?.date ?? null);
        const dueTextClass = getDueColorClass(daysRemaining);
        const iconColor = getIconColor(daysRemaining);

        return (
          <div
            key={idx}
            className="w-[350px] bg-white rounded-[30px] px-[32px] py-[42px] shadow-md flex flex-col"
          >
            {/* Top */}
            <div>
              <h3 className="text-sm font-semibold text-[#8D8DAC] pb-2">
                {internship.provider}
              </h3>
              <h2 className="text-[2.5rem] leading-[45px] font-regular capitalize bg-gradient-to-t from-[_#2F2F3A] to-[_#5F5F74] bg-clip-text text-transparent pb-2 break-words">
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
                  {internship.stipend.available
                    ? `$${internship.stipend.amount}`
                    : "Free"}
                </span>
              </p>
            </div>

            {/* Bottom (spacer + icon) */}
            <div className="mt-4 self-end">
              <BookmarkBorderIcon fontSize="medium" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
