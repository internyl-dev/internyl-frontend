import { sampleInternshipData } from "../test/sample";

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { BookmarkBorder } from "@mui/icons-material";

export default function InternshipCards() {
    return (
        <div className="internship-cards-container">
            {sampleInternshipData.map((internship, idx) => (
                <div key={idx} className="internship-card">
                    <div className="">
                        <h3 className="font-semibold text-[_#8D8DAC]">{internship.provider}</h3>
                        <h2 className="font-normal leading-[45px] text-5xl">{internship.title}</h2>
                        <p className="text-xl">
                            <AccessTimeOutlinedIcon className="inline-block mr-1" />
                            <strong>Due:{" "}
                                {
                                    internship.deadlines[0] !== null && internship.deadlines[0]?.date ?
                                        internship.deadlines[0].date.toLocaleDateString() :
                                        "Date not provided"
                                }
                            </strong>
                        </p>
                    </div>
                    <div className="">
                        <p className="text-xl">
                            <WorkOutlineOutlinedIcon className="inline-block mr-1" />
                            {internship.subject}
                        </p>
                        <p className="text-xl">
                            <AttachMoneyOutlinedIcon className="inline-block mr-1" />
                            {internship.stipend.available ?
                                `Stipend: $${internship.stipend.amount}` :
                                "Free"
                            }
                        </p>
                    </div>
                    <BookmarkBorderIcon />
                </div>
            ))}
        </div>
    );
}