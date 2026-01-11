"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CircularProgress } from "@mui/material";

export default function EditInternship() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [internship, setInternship] = useState({
    title: "",
    provider: "",
    subject: "",
    duration_weeks: "",
    cost: "",
  });
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [eligibilityGrades, setEligibilityGrades] = useState<string[]>([]);
  const [eligibilityAgeMin, setEligibilityAgeMin] = useState<number | "">("");
  const [eligibilityAgeMax, setEligibilityAgeMax] = useState<number | "">("");
  const [locationState, setLocationState] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  useEffect(() => {
    async function fetchInternship() {
      setLoading(true);
      try {
        if (!id) throw new Error("Invalid ID");
        const docRef = doc(db, "internships", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setInternship({
            title: data.title || "",
            provider: data.provider || "",
            subject: data.subject || "",
            duration_weeks: data.duration_weeks || "",
            cost: data.cost || "",
          });
          setDescription(data.description || "");
          setLink(data.link || "");
          setTags(data.tags || []);
          setEligibilityGrades(data.eligibility?.grades || []);
          setEligibilityAgeMin(data.eligibility?.age?.minimum || "");
          setEligibilityAgeMax(data.eligibility?.age?.maximum || "");
          setLocationState(data.location?.[0]?.state || "");
          setLocationCity(data.location?.[0]?.city || "");
          setLocationAddress(data.location?.[0]?.address || "");
          setDateStart(data.dates?.[0]?.start || "");
          setDateEnd(data.dates?.[0]?.end || "");
        } else {
          console.error("Internship not found");
        }
      } catch (error) {
        console.error("Error fetching internship:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInternship();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInternship((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!id) throw new Error("Invalid ID");
      const docRef = doc(db, "programs-display", id);
      await updateDoc(docRef, {
        ...internship,
        description,
        link,
        tags,
        eligibility: {
          grades: eligibilityGrades,
          age: {
            minimum: eligibilityAgeMin,
            maximum: eligibilityAgeMax,
          },
        },
        location: [
          {
            state: locationState,
            city: locationCity,
            address: locationAddress,
          },
        ],
        dates: [
          {
            start: dateStart,
            end: dateEnd,
          },
        ],
      });
      router.push("/admin/manage-internships");
    } catch (error) {
      console.error("Error updating internship:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Internship</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={internship.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Provider
            </label>
            <input
              type="text"
              name="provider"
              value={internship.provider}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              rows={4}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Application Link
            </label>
            <input
              type="url"
              name="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((tag) => tag.trim()))
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Eligibility Grades (comma separated)
            </label>
            <input
              type="text"
              name="eligibilityGrades"
              value={eligibilityGrades.join(", ")}
              onChange={(e) =>
                setEligibilityGrades(
                  e.target.value.split(",").map((grade) => grade.trim())
                )
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Age
              </label>
              <input
                type="number"
                name="eligibilityAgeMin"
                value={eligibilityAgeMin}
                onChange={(e) =>
                  setEligibilityAgeMin(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Age
              </label>
              <input
                type="number"
                name="eligibilityAgeMax"
                value={eligibilityAgeMax}
                onChange={(e) =>
                  setEligibilityAgeMax(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="locationState"
                value={locationState}
                onChange={(e) => setLocationState(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="locationCity"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="locationAddress"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="dateStart"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="dateEnd"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/manage-internships")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
