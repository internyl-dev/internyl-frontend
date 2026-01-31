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
  Box,
  useTheme,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import type { InternshipCards } from "@/lib/interfaces/internshipCards";
import { db } from "@/lib/config/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ManageInternships() {
  const [internships, setInternships] = useState<InternshipCards[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const colRef = collection(db, "internships-history");
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
      <Box
        sx={{
          mb: 3,
          px: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Manage Internships
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/admin/manage-internships/add")}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: theme.shadows[4],
          }}
          disableElevation
        >
          Add Internship
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "75vh",
          boxShadow: theme.shadows[6],
          borderRadius: 3,
          overflowX: "auto",
          mx: 1,
        }}
      >
        <Table stickyHeader size="medium" aria-label="internship table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.palette.grey[100],
              }}
            >
              <TableCell sx={{ minWidth: 100, fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ minWidth: 180, fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ minWidth: 150, fontWeight: "bold" }}>Provider</TableCell>
              <TableCell sx={{ minWidth: 120, fontWeight: "bold" }}>Subject</TableCell>
              <TableCell sx={{ minWidth: 120, fontWeight: "bold" }}>
                Duration (weeks)
              </TableCell>
              <TableCell sx={{ minWidth: 100, fontWeight: "bold" }}>Cost</TableCell>
              <TableCell sx={{ minWidth: 140, textAlign: "center", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" variant="body1" sx={{ py: 4 }}>
                    Loading internships...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : internships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" variant="body1" sx={{ py: 4 }}>
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
                      idx % 2 === 0 ? theme.palette.action.hover : "inherit",
                    transition: "background-color 0.15s ease-in-out",
                  }}
                >
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                    {internship.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{internship.overview.title}</TableCell>
                  <TableCell>{internship.overview.provider}</TableCell>
                  <TableCell>{internship.overview.subject.map((subjects) => (
                    <span key={subjects} className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-2xl m-1e mr-1">
                      {subjects}
                    </span>
                  ))}</TableCell>
                  <TableCell>{internship.dates.duration_weeks ?? "-"}</TableCell>
                  <TableCell>{internship.costs.stipend.amount || "invalid"}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          router.push(`/admin/manage-internships/${internship.id}`)
                        }
                        aria-label={`Edit internship ${internship.overview.title}`}
                        size="medium"
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          "&:hover": { bgcolor: theme.palette.primary.main },
                          color: "white",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <Edit fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(internship.id)}
                        aria-label={`Delete internship ${internship.overview.title}`}
                        size="medium"
                        sx={{
                          bgcolor: theme.palette.error.light,
                          "&:hover": { bgcolor: theme.palette.error.main },
                          color: "white",
                          transition: "background-color 0.2s",
                        }}
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
