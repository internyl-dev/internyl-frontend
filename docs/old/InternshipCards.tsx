"use client";

import React, { useEffect, useState } from "react";

import { getDaysRemaining } from "../modules/getTimeRemaining";
import { getDueColorClass } from "../modules/getDueDateTextColor";
import { getIconColor } from "../modules/getDueDateIconColor";
import { InternshipCards as InternshipType } from "../types/internshipCards";

import { useRouter } from "next/navigation";

// Firebase
import { db } from "@/lib/config/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

// MUI Icons
import {
  AccessTimeOutlined as TimeIcon,
  WorkOutlineOutlined as WorkIcon,
  AttachMoneyOutlined as MoneyIcon,
  BookmarkBorder as BookmarkBorderIcon,
  BookmarkOutlined as BookmarkFilledIcon,
  SchoolOutlined as SchoolIcon,
} from "@mui/icons-material";

interface Props {
  internships: InternshipType[];
}

export default function InternshipCards({ internships }: Props) {
  const auth = getAuth();
  const router = useRouter();

  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          const saved = data.savedInternships || [];
          const savedMap: { [key: string]: boolean } = {};
          saved.forEach((id: string) => {
            savedMap[id] = true;
          });
          setBookmarked(savedMap);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const bookmarkInternship = async (internshipId: string) => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/pages/signup"); 
      console.error("User not logged in");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userDocRef, {
        savedInternships: arrayUnion(internshipId),
      });
      console.log("Internship bookmarked!");
    } catch (error) {
      console.error("Error bookmarking internship:", error);
    }
  };

  

  return (
    <div className="flex flex-wrap justify-center items-start gap-8 mt-10">
      {internships.map((internship) => {
        const internshipId = internship.id;
        const daysRemaining = getDaysRemaining(internship.deadlines[0]?.date ?? null);
        const dueTextClass = getDueColorClass(daysRemaining);
        const iconColor = getIconColor(daysRemaining);

        return (
          <div
            key={internshipId}
            className="w-[350px] bg-white rounded-[30px] px-[32px] py-[42px] shadow-lg border border-black/30 flex flex-col"
          >
            <div>
              <h3 className="text-sm font-semibold text-[#8D8DAC] pb-2">
                {internship.provider}
              </h3>
              <h2 className="text-[2.5rem] leading-[45px] font-regular capitalize bg-gradient-to-t from-[_#2F2F3A] to-[_#5F5F74] bg-clip-text text-transparent pb-2 break-words">
                {internship.title}
              </h2>
              <p className={`text-base font-medium flex items-center text-[1.2rem] ${dueTextClass}`}>
                <TimeIcon className="mr-2" sx={{ color: iconColor, fontSize: 26 }} />
                <span className="font-bold">Due: </span>
                <span className="ml-1">
                  {internship.deadlines[0]?.date
                    ? internship.deadlines[0].date.toLocaleDateString()
                    : "Date not provided"}
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
                  {internship.eligibility.rising ? "Rising " : ""}
                  {internship.eligibility.grades
                    .map((grade) => grade.charAt(0).toUpperCase() + grade.slice(1))
                    .join(", ")}
                </span>
              </p>
              <p className="text-base flex items-center text-[1.2rem] text-[#2BA280]">
                <MoneyIcon className="mr-2" fontSize="small" />
                <span>
                  {internship.stipend.available && internship.stipend.amount !== null
                    ? `$${internship.stipend.amount}`
                    : "Free"}
                </span>
              </p>
            </div>

            <div className="mt-4 text-right">
              <button
                disabled={bookmarked[internshipId]}
                onClick={async () => {
                  if (!bookmarked[internshipId]) {
                    setBookmarked((prev) => ({ ...prev, [internshipId]: true }));
                    await bookmarkInternship(internshipId);
                  }
                }}
                className="text-[#8D8DAC] hover:text-[#2F2F3A] transition-colors cursor-pointer"
              >
                {bookmarked[internshipId] ? (
                  <BookmarkFilledIcon fontSize="medium" className="text-[#2F2F3A]" />
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
