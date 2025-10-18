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

  // Common fields & Missing fields
  const [reportDetails, setReportDetails] = useState("");
  // const [_missingFields, _setMissingFields] = useState<string[]>([]);

  // Incorrect info specific
  const [internships, setInternships] = useState<InternshipCards[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [incorrectInfoType, setIncorrectInfoType] = useState("");
  const [correctInfo, setCorrectInfo] = useState("");

  // Bug
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugSteps, setBugSteps] = useState("");
  const [bugSeverity, setBugSeverity] = useState("Medium");

  // Other
  const [otherSubject, setOtherSubject] = useState("");
  const [otherDescription, setOtherDescription] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Please log in to submit a report.");
        router.push(`/pages/login?redirect=${encodeURIComponent("/pages/report")}`); // FIX THIS; DOESNT WORK
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
        const querySnapshot = await getDocs(collection(db, "programs-display"));
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

  // Helper to validate internship selection is from the list
  const isValidInternship = (selected: string) => {
    return internships.some(
      (int) => `${int.overview.title} — ${int.overview.provider}` === selected
    );
  };

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

    setSubmitting(true);

    // Validate required fields per report type
    if (reportType === "info") {
      if (!isValidInternship(searchTerm)) {
        toast.error("Please select a valid internship from the list.");
        setSubmitting(false);
        return;
      }
      if (!incorrectInfoType) {
        toast.error("Please select the incorrect info type.");
        setSubmitting(false);
        return;
      }
      if (!correctInfo.trim()) {
        toast.error("Please provide the correct info.");
        setSubmitting(false);
        return;
      }
    } else if (reportType === "bug") {
      if (!bugTitle.trim()) {
        toast.error("Please enter a bug title.");
        setSubmitting(false);
        return;
      }
      if (!bugDescription.trim()) {
        toast.error("Please enter a bug description.");
        setSubmitting(false);
        return;
      }
      if (!bugSteps.trim()) {
        toast.error("Please describe steps to reproduce.");
        setSubmitting(false);
        return;
      }
      if (!bugSeverity) {
        toast.error("Please select a severity level.");
        setSubmitting(false);
        return;
      }
    } else if (reportType === "other") {
      if (!otherSubject.trim()) {
        toast.error("Please enter a subject.");
        setSubmitting(false);
        return;
      }
      if (!otherDescription.trim()) {
        toast.error("Please enter a description.");
        setSubmitting(false);
        return;
      }
    }

    if (!user) {
      toast.error("User not authenticated.");
      setSubmitting(false);
      return;
    }

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
        reportDetails:
          reportType === "info"
            ? reportDetails
            : reportType === "bug"
              ? bugDescription
              : reportType === "other"
                ? otherDescription
                : "",

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

      await toast.promise(
        setDoc(doc(db, "reports", reportId), newReport),
        {
          loading: "Submitting report...",
          success: "Report submitted successfully!",
          error: "Failed to submit report.",
        }
      );

      // Send full report data to backend for email notification
      await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });

      setStep(2);
      setSubmitting(false);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit report.");
      setSubmitting(false);
    }
  };

  const filteredInternships = internships.filter(
    (int) =>
      int.overview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      int.overview.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSearchTerm(value);
    setIsDropdownVisible(false);
  };

  if (loading) return <p className="text-center mt-20">Checking authentication...</p>;
  if (!user) return null;

  return (
    <div className="mt-20 px-4 py-2">
      {step !== 2 ? (
        <form className="bg-gradient-to-br from-white/70 to-gray-50/50 backdrop-blur-sm border border-white/40 rounded-3xl shadow-2xl p-10 max-w-3xl mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-xl text-center mb-4 font-semibold">Report an Issue</h1>

          {step === 0 && (
            <>
              <div className="flex flex-col items-center px-4 text-center">
                <label className="text-lg font-medium mb-3">Issue Type</label>
                <select
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-3 border rounded-lg text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType["reportType"])}
                >
                  <option value="info">Incorrect Information on Internship Card</option>
                  <option value="bug">Bug / Issue on Website</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                className="bg-blue-500 text-white px-5 py-3 rounded-2xl hover:bg-blue-600 transition-colors mx-auto block mt-4"
                onClick={handleStepOne}
              >
                Next <ArrowForwardIcon className="inline-block ml-1" />
              </button>
            </>
          )}


          {step === 1 && (
            <>
              {/* Info Report Form */}
              {reportType === "info" && (
                <>
                  <div className="text-center m-4 font-semibold text-lg">
                    Report Incorrect Information
                    <p className="font-light text-[1rem]">An asterisk (*) indicates required information.</p>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Internship*</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsDropdownVisible(true)}
                      onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
                      className="w-full border rounded-md p-2 mb-2"
                      placeholder="Search by title or provider"
                      required
                    />
                    {isDropdownVisible && filteredInternships.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md w-full max-h-40 overflow-y-auto">
                        {filteredInternships.map((int) => (
                          <li
                            key={int.id}
                            onClick={() => handleSelect(`${int.overview.title} — ${int.overview.provider}`)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {int.overview.title} — {int.overview.provider}
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
                    required
                  >
                    <option value="" disabled>Select the incorrect info</option>
                    <option value="internshipName">Internship Name</option>
                    <option value="provider">Provider</option>
                    <option value="location">Location</option>
                    <option value="dates">Dates</option>
                    <option value="link">Link</option>
                    <option value="other">Other</option>
                  </select>

                  {incorrectInfoType && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Info
                      </label>
                      <div className="px-4 py-3 bg-gradient-to-br from-white/60 to-gray-50/40 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg">
                        {(() => {
                          const selected = internships.find(
                            (int) => `${int.overview.title} — ${int.overview.provider}` === searchTerm
                          );
                          if (!selected) return "Not available";

                          switch (incorrectInfoType) {
                            case "internshipName":
                              return selected.overview.title;
                            case "provider":
                              return selected.overview.provider;
                            case "location":
                              return selected.locations.locations.map((loc) => `${loc.city}, ${loc.state}`).join("; ");
                            case "dates":
                              return selected.dates.dates.map((d) =>
                                `${d.start ? new Date(d.start).toLocaleDateString() : "N/A"} - ${d.end ? new Date(d.end).toLocaleDateString() : "N/A"}`
                              ).join("; ");
                            case "link":
                              return `Current Link - ${selected.overview.link}` || "No link provided";
                            default:
                              return "Not available";
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Info*</label>
                  <textarea
                    className="w-full border rounded-md p-2 mb-4"
                    placeholder="Provide the correct information here. Please be as detailed as possible. If you don't know the exact info, describe what needs to be changed."
                    rows={3}
                    value={correctInfo}
                    onChange={(e) => setCorrectInfo(e.target.value)}
                    required
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    className="w-full border rounded-md p-2 mb-4"
                    placeholder="Add any additional context/comments/concerns about the incorrect info."
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
                <div className="px-4 py-3 bg-gradient-to-br from-white/60 to-blue-50/40 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg">
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
                disabled={submitting}
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors block mx-auto cursor-pointer"
              >
                Submit Report
              </button>
            </>
          )}
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-10 space-y-6 bg-gradient-to-br from-white/70 to-green-50/50 backdrop-blur-sm border border-white/40 rounded-3xl shadow-2xl max-w-3xl mx-auto mt-[20vh] mb-[25vh]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
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
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
}
