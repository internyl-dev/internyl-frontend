"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/config/firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Report as ReportType } from "@/lib/types/report";
import { InternshipCards } from "@/lib/types/internshipCards";

export default function ReportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [reportType, setReportType] = useState<ReportType["reportType"]>("info");

  // Common fields
  const [reportDetails, setReportDetails] = useState("");

  // Incorrect info specific
  const [internships, setInternships] = useState<InternshipCards[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [incorrectInfoType, setIncorrectInfoType] = useState("");
  const [correctInfo, setCorrectInfo] = useState("");

  // Bug specific
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugSteps, setBugSteps] = useState("");
  const [bugSeverity, setBugSeverity] = useState("Medium");

  // Other specific
  const [otherSubject, setOtherSubject] = useState("");
  const [otherDescription, setOtherDescription] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Please log in to submit a report.");
        router.push(`/login?redirect=/report`);
      } else {
        setUser(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "internships"));
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as InternshipCards[];
        setInternships(fetched);
      } catch (err) {
        console.error("Error fetching internships:", err);
        toast.error("Failed to load internships.");
      }
    };
    fetchInternships();
  }, []);

  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType) {
      toast.error("Please select a report type.");
      return;
    }
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields per report type
    if (reportType === "info") {
      if (!reportDetails.trim()) {
        toast.error("Please add comments for your report.");
        return;
      }
      if (!searchTerm) {
        toast.error("Please select an internship.");
        return;
      }
      if (!incorrectInfoType) {
        toast.error("Please select the incorrect info type.");
        return;
      }
      if (!correctInfo.trim()) {
        toast.error("Please provide the correct info.");
        return;
      }
    } else if (reportType === "bug") {
      if (!bugTitle.trim()) {
        toast.error("Please enter a bug title.");
        return;
      }
      if (!bugDescription.trim()) {
        toast.error("Please enter a bug description.");
        return;
      }
      if (!bugSteps.trim()) {
        toast.error("Please describe steps to reproduce.");
        return;
      }
      if (!bugSeverity) {
        toast.error("Please select a severity level.");
        return;
      }
    } else if (reportType === "other") {
      if (!otherSubject.trim()) {
        toast.error("Please enter a subject.");
        return;
      }
      if (!otherDescription.trim()) {
        toast.error("Please enter a description.");
        return;
      }
    }

    if (!user) return;

    try {
      const reportId = `report-${crypto.randomUUID()}`;

      // Build new report object, with conditional fields depending on type
      const newReport: ReportType = {
        id: reportId,
        userId: user.uid,
        userEmail: user.email || "no-email",
        reportType,
        createdAt: new Date(),
        status: "pending",
        // Include common comments or description per type
        reportDetails: reportType === "info" ? reportDetails :
                       reportType === "bug" ? bugDescription :
                       reportType === "other" ? otherDescription : "",

        // Incorrect info extra fields
        ...(reportType === "info" && {
          internship: searchTerm,
          incorrectInfoType,
          correctInfo,
          comments: reportDetails,
        }),

        // Bug specific fields
        ...(reportType === "bug" && {
          bugTitle,
          bugDescription,
          bugSteps,
          bugSeverity,
        }),

        // Other specific fields
        ...(reportType === "other" && {
          otherSubject,
          otherDescription,
        }),
      };

      await setDoc(doc(db, "reports", reportId), newReport);

      // Send full report data to backend for email notification
      await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });

      toast.success("Report submitted successfully!");
      setStep(2);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit report.");
    }
  };

  const filteredInternships = internships.filter((int) =>
    int.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    int.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSearchTerm(value);
    setIsDropdownVisible(false);
  };

  if (loading) return <p className="text-center mt-20">Checking authentication...</p>;
  if (!user) return null;

  return (
    <div className="mt-20 px-4 py-2">
      <form className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto">
        <h1 className="text-xl text-center mb-4 font-semibold">Report an Issue</h1>

        {step === 0 && (
          <>
            <div className="text-center">
              <label>Issue Type</label>
              <select
                className="w-max-3xl mt-2 mb-4 p-2 border rounded m-4"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType["reportType"])}
              >
                <option value="info">Incorrect Information on Internship Card</option>
                <option value="bug">Bug / Issue on Website</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded-2xl hover:bg-blue-600 transition-colors cursor-pointer justified mx-auto block"
              onClick={handleStepOne}
            >
              Next <ArrowForwardIcon />
            </button>
          </>
        )}

        {step === 1 && (
          <>
            {/* Info Report Form */}
            {reportType === "info" && (
              <>
                <div className="text-center m-4 font-semibold text-lg">Report Incorrect Information</div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Internship</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownVisible(true)}
                    onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
                    className="w-full border rounded-md p-2 mb-2"
                    placeholder="Search by title or provider"
                  />
                  {isDropdownVisible && filteredInternships.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md w-full max-h-40 overflow-y-auto">
                      {filteredInternships.map((int) => (
                        <li
                          key={int.id}
                          onClick={() => handleSelect(`${int.title} — ${int.provider}`)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {int.title} — {int.provider}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Incorrect Info</label>
                <select
                  className="w-full border rounded-md p-2 mb-4"
                  onChange={(e) => setIncorrectInfoType(e.target.value)}
                  value={incorrectInfoType}
                >
                  <option value="" disabled>Select the incorrect info</option>
                  <option value="internshipName">Internship Name</option>
                  <option value="provider">Provider</option>
                  <option value="location">Location</option>
                  <option value="dates">Dates</option>
                  <option value="other">Other</option>
                </select>

                {incorrectInfoType && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Info
                    </label>
                    <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl shadow-sm">
                      {(() => {
                        const selected = internships.find(
                          (int) => `${int.title} — ${int.provider}` === searchTerm
                        );
                        if (!selected) return "Not available";

                        switch (incorrectInfoType) {
                          case "internshipName":
                            return selected.title;
                          case "provider":
                            return selected.provider;
                          case "location":
                            return selected.location.map((loc) => `${loc.city}, ${loc.state}`).join("; ");
                          case "dates":
                            return selected.dates.map((d) =>
                              `${d.start?.toLocaleDateString()} - ${d.end?.toLocaleDateString()}`
                            ).join("; ");
                          default:
                            return "Not available";
                        }
                      })()}
                    </div>
                  </div>
                )}

                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Info</label>
                <textarea
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Provide the correct information here"
                  rows={3}
                  value={correctInfo}
                  onChange={(e) => setCorrectInfo(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                <textarea
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Add any additional context"
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                />
              </>
            )}

            {/* Bug Report Form */}
            {reportType === "bug" && (
              <>
                <div className="text-center m-4 font-semibold text-lg">Report a Bug / Issue</div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Bug Title</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Short summary of the bug"
                  value={bugTitle}
                  onChange={(e) => setBugTitle(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Bug Description</label>
                <textarea
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Describe the bug in detail"
                  rows={4}
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Steps to Reproduce</label>
                <textarea
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="List the steps to reproduce the bug"
                  rows={3}
                  value={bugSteps}
                  onChange={(e) => setBugSteps(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  className="w-full border rounded-md p-2 mb-4"
                  value={bugSeverity}
                  onChange={(e) => setBugSeverity(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </>
            )}

            {/* Other Report Form */}
            {reportType === "other" && (
              <>
                <div className="text-center m-4 font-semibold text-lg">Other Report</div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Brief subject"
                  value={otherSubject}
                  onChange={(e) => setOtherSubject(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Detailed description"
                  rows={4}
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                />
              </>
            )}

            {/* User Info Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl shadow-sm">
                {user.uid}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl shadow-sm">
                {user.email}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors block mx-auto cursor-pointer"
            >
              Submit Report
            </button>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700">Report Submitted</h2>
            <p className="text-gray-600 max-w-md">
              Thank you for helping us keep the platform accurate and functional. We’ll review your report as soon as possible.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
