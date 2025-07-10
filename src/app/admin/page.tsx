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
      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>

      <Button variant="contained" onClick={uploadInternships} sx={{ mb: 2 }}>
        Upload Sample Internship Data
      </Button>

      {status && <Typography>{status}</Typography>}
    </AdminLayout>
  );
}
