"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { InternshipCards } from "@/lib/types/internshipCards"; // adjust the path if needed

export default function AddInternshipPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<InternshipCards>({
    id: uuidv4(),
    overview: {
      title: "",
      provider: "",
      description: "",
      link: "",
      subject: [],
      tags: [],
    },
    eligibility: {
      requirements: {
        essay_required: "not provided",
        recommendation_required: "not provided",
        transcript_required: "not provided",
        other: [],
      },
      eligibility: {
        grades: [],
        age: {
          minimum: "not provided",
          maximum: "not provided",
        },
      },
    },
    dates: {
      deadlines: [],
      dates: [],
      duration_weeks: "not provided",
    },
    locations: {
      locations: [],
    },
    costs: {
      costs: [],
      stipend: {
        available: "not provided",
        amount: "not provided",
      },
    },
    contact: {
      contact: {
        email: "",
        phone: "",
      },
    },
  });

  const handleChange = <K extends keyof InternshipCards>(
    section: K,
    field: string,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add internship");

      router.push("/admin");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">Add Internship</h1>

      {/* Overview Section */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.overview.title}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              overview: { ...prev.overview, title: e.target.value },
            }))
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Provider"
          value={formData.overview.provider}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              overview: { ...prev.overview, provider: e.target.value },
            }))
          }
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={formData.overview.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              overview: { ...prev.overview, description: e.target.value },
            }))
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Link"
          value={formData.overview.link}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              overview: { ...prev.overview, link: e.target.value },
            }))
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Internship
      </button>
    </div>
  );
}
