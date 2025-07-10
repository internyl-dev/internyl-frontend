"use client";

import { Button, Typography } from "@mui/material";
import { sampleInternshipData } from "@/lib/test/sample";
import { db } from "@/lib/config/firebaseConfig";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useState } from "react";
import AdminLayout from "./layout/AdminLayout";

function convertDates(obj: any): any {
  if (obj instanceof Date) return Timestamp.fromDate(obj);
  if (Array.isArray(obj)) return obj.map(convertDates);
  if (obj && typeof obj === "object") {
    const out: any = {};
    for (const key in obj) out[key] = convertDates(obj[key]);
    return out;
  }
  return obj;
}

export default function AdminDashboard() {
  const [status, setStatus] = useState("");

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
      <h2 className="text-[2.5rem] text-center font-semibold">Admin Dashboard</h2>

      <div className="flex items-center justify-center flex-row gap-4 mt-8">
        <div className="text-center bg-white p-6 rounded-xl shadow-md w-full max-w-screen">
          <h3 className="pb-2 font-bold">Upload Internship Data</h3>
          <p className="pb-2">Clicking this button will upload the internships stored in sample.ts</p>
          <Button
            onClick={uploadInternships}
            variant="contained"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors m-w-[300px]">
            Upload Sample Internship Data
          </Button>
          {status && <Typography>{status}</Typography>}
        </div>
        
      </div>
    </AdminLayout>
  );
}
