"use client";

import { Button, Typography } from "@mui/material";
import { sampleInternshipData } from "@/lib/test/sample";
import { db } from "@/lib/config/firebaseConfig";
import { setDoc, doc, Timestamp, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import AdminLayout from "./layout/AdminLayout";

// 🔧 Type-safe conversion of nested Dates to Firestore Timestamps
function convertDates<T>(obj: T): T {
  if (obj instanceof Date) return Timestamp.fromDate(obj) as T;
  if (Array.isArray(obj)) return obj.map(convertDates) as T;
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const key in obj) {
      out[key] = convertDates((obj as Record<string, unknown>)[key]);
    }
    return out as T;
  }
  return obj;
}

export default function AdminDashboard() {
  const [status, setStatus] = useState("");
  const [internshipCount, setInternshipCount] = useState<number>(0);

  const fetchCount = async () => {
    const snapshot = await getDocs(collection(db, "internships"));
    setInternshipCount(snapshot.size);
  };

  useEffect(() => {
    fetchCount();
  }, [status]);

  const uploadInternships = async () => {
    try {
      for (const internship of sampleInternshipData) {
        await setDoc(doc(db, "internships", internship.id), convertDates(internship));
      }
      setStatus("✅ All internships uploaded successfully.");
    } catch (e) {
      console.error(e);
      setStatus("❌ Upload failed. Check console.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-[2.5rem] text-center font-bold tracking-tight mb-8 mt-2 text-gray-900 drop-shadow-sm">
          Admin Dashboard
        </h2>

        {/* Top row: upload + count */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 w-full">
          {/* Upload box */}
          <div
            className="flex-1 p-7 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
            }}
          >
            <h3 className="pb-2 font-bold text-lg text-blue-700">Upload Internship Data</h3>
            <p className="pb-2 text-gray-600 text-sm text-center">
              Clicking this button will upload the internships stored in{" "}
              <span className="font-mono">sample.ts</span>
            </p>
            <Button
              onClick={uploadInternships}
              variant="contained"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full max-w-xs mt-2"
            >
              Upload Sample Internship Data
            </Button>
            {status && <Typography className="mt-2 text-sm">{status}</Typography>}
          </div>

          {/* Internship count box */}
          <div
            className="flex-1 p-7 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
            }}
          >
            <h3 className="pb-2 font-bold text-lg text-purple-700 flex items-center gap-2">
              Internship Count
            </h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-2">{internshipCount}</p>
            <p className="text-gray-600 text-sm">Total internships in database</p>
            <Button
              size="small"
              variant="outlined"
              className="ml-2 px-2 py-2 text-xs top-2"
              onClick={fetchCount}
              style={{ minWidth: 0 }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
