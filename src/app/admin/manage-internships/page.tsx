"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import type { InternshipCards } from "@/lib/types/internshipCards";
import { db } from "@/lib/config/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ManageInternships() {
  const [internships, setInternships] = useState<InternshipCards[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const colRef = collection(db, "internships");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((d) => d.data() as InternshipCards);
        setInternships(data);
      } catch (error) {
        console.error("Error fetching internships:", error);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship?")) return;
    try {
      await deleteDoc(doc(db, "internships", id));
      setInternships((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete internship:", error);
    }
  };

  return (
    <AdminLayout>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ px: 1 }}
      >
        <Typography variant="h4" fontWeight={600}>
          Manage Internships
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/admin/manage-internships/add")}
          sx={{ px: 3, py: 1.2 }}
        >
          Add Internship
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "75vh",
          boxShadow: 3,
          borderRadius: 2,
          overflowX: "auto",
          mx: 1,
        }}
      >
        <Table stickyHeader size="medium" aria-label="internship table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) => theme.palette.grey[200],
              }}
            >
              <TableCell sx={{ minWidth: 100 }}>ID</TableCell>
              <TableCell sx={{ minWidth: 180 }}>Title</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Provider</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Subject</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Duration (weeks)</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Cost</TableCell>
              <TableCell sx={{ minWidth: 140, textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow key="loading-row">
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" variant="body1">
                    Loading internships...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : internships.length === 0 ? (
              <TableRow key="no-data-row">
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" variant="body1">
                    No internships found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              internships.map((internship, idx) => (
                <TableRow
                  key={internship.id}
                  hover
                  sx={{
                    backgroundColor:
                      idx % 2 === 0
                        ? (theme) => theme.palette.action.hover
                        : "inherit",
                  }}
                >
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {internship.id}
                  </TableCell>
                  <TableCell>{internship.title}</TableCell>
                  <TableCell>{internship.provider}</TableCell>
                  <TableCell>{internship.subject || "-"}</TableCell>
                  <TableCell>{internship.duration_weeks ?? "-"}</TableCell>
                  <TableCell>{internship.cost}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          router.push(`/admin/manage-internships/${internship.id}`)
                        }
                        aria-label={`Edit internship ${internship.title}`}
                        size="medium"
                      >
                        <Edit fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(internship.id)}
                        aria-label={`Delete internship ${internship.title}`}
                        size="medium"
                      >
                        <Delete fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
}
