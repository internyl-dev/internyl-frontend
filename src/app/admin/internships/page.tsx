"use client";

import { useState, useEffect } from "react";
import { InternshipCards } from "@/lib/types/internshipCards";
import { db } from "@/lib/config/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import AdminNav from "../AdminNav";
import SearchBar from "@/lib/components/SearchBar";

export default function InternshipManager() {
  const [internships, setInternships] = useState<InternshipCards[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInternship, setSelectedInternship] = useState<InternshipCards | null>(null);

  const fetchInternships = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "programs-display"));
    const data = snapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as InternshipCards)
    );
    setInternships(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this internship?")) {
      await deleteDoc(doc(db, "programs-display", id));
      setInternships((prev) => prev.filter((i) => i.id !== id));
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const filtered = internships.filter((i) =>
    i.overview.title.toLowerCase().includes(search.toLowerCase()) ||
    i.overview.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-800">
      <AdminNav title="Manage Internships" />

      {/* Search bar */}
      <SearchBar setSearch={setSearch} padding="pt-10 pb-6"/>

      {/* Table container */}
      <div className="mt-6 mx-4 md:mx-8 p-4 rounded-3xl border border-gray-200/30 bg-white/30 backdrop-blur-lg shadow-md overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse mt-10">Loading internships...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-sm font-semibold">ID</th>
                <th className="px-4 py-2 text-sm font-semibold">Title</th>
                <th className="px-4 py-2 text-sm font-semibold">Provider</th>
                <th className="px-4 py-2 text-sm font-semibold">Subjects</th>
                <th className="px-4 py-2 text-sm font-semibold">Tags</th>
                <th className="px-4 py-2 text-sm font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((internship) => (
                <tr
                  key={internship.id}
                  className="hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setSelectedInternship(internship)}
                >
                  <td className="px-4 py-3 text-xs font-mono">{internship.id}</td>
                  <td className="px-4 py-3 font-medium">{internship.overview.title}</td>
                  <td className="px-4 py-3">{internship.overview.provider}</td>
                  <td className="px-4 py-3 text-sm">
                    {internship.overview.subject.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {internship.overview.tags.join(", ")}
                  </td>
                  <td className="px-4 py-3 flex justify-end items-center gap-2">
                    <VisibilityIcon
                      className="text-gray-700 hover:text-blue-600"
                      fontSize="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInternship(internship);
                      }}
                    />
                    <EditIcon
                      className="text-gray-700 hover:text-green-600"
                      fontSize="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Edit feature not yet implemented");
                      }}
                    />
                    <DeleteIcon
                      className="text-gray-700 hover:text-red-600"
                      fontSize="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(internship.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail drawer */}
      {selectedInternship && (
        <div className="w-[400px] bg-white/30 backdrop-blur-xl border-l border-gray-300 shadow-xl p-6 overflow-y-auto fixed right-0 top-20 h-full animate-slideIn">
          <button
            className="absolute right-4 top-4 text-gray-600 hover:text-red-600"
            onClick={() => setSelectedInternship(null)}
          >
            ✕
          </button>

          <h3 className="text-2xl font-bold mb-2">{selectedInternship.overview.title}</h3>
          <p className="text-gray-600 mb-4">{selectedInternship.overview.provider}</p>
          <p className="text-sm text-gray-700 mb-6">{selectedInternship.overview.description}</p>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">Subjects</h4>
              <p className="text-sm text-gray-600">{selectedInternship.overview.subject.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Tags</h4>
              <p className="text-sm text-gray-600">{selectedInternship.overview.tags.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Contact</h4>
              <p className="text-sm text-gray-600">📧 {selectedInternship.contact.contact.email}</p>
              <p className="text-sm text-gray-600">☎️ {selectedInternship.contact.contact.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
