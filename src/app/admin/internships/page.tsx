"use client";

import { useState, useEffect } from "react";
import AdminNav from "../AdminNav";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import { InternshipCards, Grade, Deadline, DateRange, Location, CostItem } from "@/lib/types/internshipCards";

import {
  // Button,
  // TextField,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  CircularProgress,
  // Tabs,
  // Tab,
  Box,
  // Chip,
  // FormControlLabel,
  // Checkbox,
  // Select,
  // MenuItem,
  // InputLabel,
  // FormControl,
  // IconButton,
} from "@mui/material";
// import { Plus, Trash2, Pencil, Eye, X } from "lucide-react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminInternships() {
  const [internships, setInternships] = useState<InternshipCards[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInternship, setEditingInternship] = useState<InternshipCards | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Input states for arrays
  const [subjectInput, setSubjectInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [otherReqInput, setOtherReqInput] = useState("");

  const internshipsRef = collection(db, "programs-display");

  const emptyInternship: InternshipCards = {
    id: "",
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
        age: { minimum: "not provided", maximum: "not provided" },
      },
    },
    dates: {
      deadlines: [],
      dates: [],
      duration_weeks: "not provided",
    },
    locations: { locations: [] },
    costs: {
      costs: [],
      stipend: { available: "not provided", amount: "not provided" },
    },
    contact: { contact: { email: "", phone: "" } },
  };

  const fetchInternships = async () => {
    setLoading(true);
    const snapshot = await getDocs(internshipsRef);
    const data: InternshipCards[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<InternshipCards, "id">),
    }));
    setInternships(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this internship?")) {
      await deleteDoc(doc(db, "programs-display", id));
      fetchInternships();
    }
  };

  const handleSave = async () => {
    if (!editingInternship) return;

    if (editingInternship.id) {
      const docRef = doc(db, "programs-display", editingInternship.id);
      const { id, ...internshipData } = editingInternship;
      await updateDoc(docRef, internshipData);
    } else {
      const { id, ...internshipData } = editingInternship;
      await addDoc(internshipsRef, internshipData);
    }

    setOpenDialog(false);
    setTabValue(0);
    fetchInternships();
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const filteredInternships = internships.filter(
    (intern) =>
      intern.overview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.overview.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper functions for managing arrays
  const addToArray = (field: keyof Pick<InternshipCards['overview'], 'subject' | 'tags'>, value: string) => {
    if (!editingInternship || !value.trim()) return;
    setEditingInternship({
      ...editingInternship!,
      overview: {
        ...editingInternship!.overview,
        [field]: [...editingInternship!.overview[field], value.trim()],
      },
    });
  };

  const removeFromArray = (
    field: keyof Pick<InternshipCards['overview'], 'subject' | 'tags'>,
    index: number
  ) => {
    if (!editingInternship) return;
    if (!editingInternship.overview) return;
    const newArray = [...editingInternship.overview[field]];
    newArray.splice(index, 1);
    setEditingInternship({
      ...editingInternship,
      overview: { ...editingInternship.overview, [field]: newArray },
    });
  };

  // Deadline management
  const addDeadline = () => {
    if (!editingInternship) return;
    const newDeadline: Deadline = {
      name: "",
      priority: "not provided",
      term: "",
      date: "not provided",
      rolling_basis: "not provided",
      time: "",
    };
    setEditingInternship({
      ...editingInternship,
      dates: {
        ...editingInternship.dates,
        deadlines: [...editingInternship.dates.deadlines, newDeadline],
      },
    });
  };

  const updateDeadline = (index: number, field: keyof Deadline, value: any) => {
    if (!editingInternship) return;
    const newDeadlines = [...editingInternship.dates.deadlines];
    newDeadlines[index] = { ...newDeadlines[index], [field]: value };
    setEditingInternship({
      ...editingInternship,
      dates: { ...editingInternship.dates, deadlines: newDeadlines },
    });
  };

  const removeDeadline = (index: number) => {
    if (!editingInternship) return;
    const newDeadlines = [...editingInternship.dates.deadlines];
    newDeadlines.splice(index, 1);
    setEditingInternship({
      ...editingInternship,
      dates: { ...editingInternship.dates, deadlines: newDeadlines },
    });
  };

  // Date Range management
  const addDateRange = () => {
    if (!editingInternship) return;
    const newDate: DateRange = { term: "", start: "not provided", end: "not provided" };
    setEditingInternship({
      ...editingInternship,
      dates: { ...editingInternship.dates, dates: [...editingInternship.dates.dates, newDate] },
    });
  };

  const updateDateRange = (index: number, field: keyof DateRange, value: any) => {
    if (!editingInternship) return;
    const newDates = [...editingInternship.dates.dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setEditingInternship({
      ...editingInternship,
      dates: { ...editingInternship.dates, dates: newDates },
    });
  };

  const removeDateRange = (index: number) => {
    if (!editingInternship) return;
    const newDates = [...editingInternship.dates.dates];
    newDates.splice(index, 1);
    setEditingInternship({
      ...editingInternship,
      dates: { ...editingInternship.dates, dates: newDates },
    });
  };

  // Location management
  const addLocation = () => {
    if (!editingInternship) return;
    const newLocation: Location = { virtual: "not provided", state: "", city: "", address: "" };
    setEditingInternship({
      ...editingInternship,
      locations: { locations: [...editingInternship.locations.locations, newLocation] },
    });
  };

  const updateLocation = (index: number, field: keyof Location, value: any) => {
    if (!editingInternship) return;
    const newLocations = [...editingInternship.locations.locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setEditingInternship({
      ...editingInternship,
      locations: { locations: newLocations },
    });
  };

  const removeLocation = (index: number) => {
    if (!editingInternship) return;
    const newLocations = [...editingInternship.locations.locations];
    newLocations.splice(index, 1);
    setEditingInternship({
      ...editingInternship,
      locations: { locations: newLocations },
    });
  };

  // Cost management
  const addCost = () => {
    if (!editingInternship) return;
    const newCost: CostItem = {
      name: "",
      free: "not provided",
      lowest: "not provided",
      highest: "not provided",
      "financial-aid-available": "not provided",
    };
    setEditingInternship({
      ...editingInternship,
      costs: { ...editingInternship.costs, costs: [...editingInternship.costs.costs, newCost] },
    });
  };

  const updateCost = (index: number, field: keyof CostItem, value: any) => {
    if (!editingInternship) return;
    const newCosts = [...editingInternship.costs.costs];
    newCosts[index] = { ...newCosts[index], [field]: value };
    setEditingInternship({
      ...editingInternship,
      costs: { ...editingInternship.costs, costs: newCosts },
    });
  };

  const removeCost = (index: number) => {
    if (!editingInternship) return;
    const newCosts = [...editingInternship.costs.costs];
    newCosts.splice(index, 1);
    setEditingInternship({
      ...editingInternship,
      costs: { ...editingInternship.costs, costs: newCosts },
    });
  };

  return (
    <div>
      <AdminNav />
      <section>
        <h3 className="text-center text-lg font-light mt-6">Admin Dashboard</h3>
        <h1 className="text-center text-3xl font-bold">Internships Manager</h1>
      </section>

      <div className="flex justify-between items-center max-w-6xl mx-auto mt-8 px-4">
        <div className="flex items-center gap-3 w-1/2">
          <input
            type="search"
            aria-label="Search internships"
            placeholder="Search internships by title or provider..."
            className="w-full px-4 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm"
          onClick={() => {
            setEditingInternship(emptyInternship);
            setOpenDialog(true);
            setTabValue(0);
          }}
        >
          <span className="text-lg">+</span>
          <span className="font-medium">Add Internship</span>
        </button>
      </div>

      <section
        className="max-w-6xl mx-auto mt-10 p-6 rounded-3xl shadow-lg border border-white/40 backdrop-blur-lg bg-white/30"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 text-gray-700 font-semibold">
                  <th className="py-3 px-4 rounded-tl-2xl">Title</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4">Grade Eligibility</th>
                  <th className="py-3 px-4 text-center rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No internships found.
                    </td>
                  </tr>
                ) : (
                  filteredInternships.map((intern) => (
                    <tr
                      key={intern.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {intern.overview.title || <span className="text-gray-400">Untitled</span>}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{intern.overview.provider || "—"}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex flex-wrap gap-2">
                          {(intern.overview.tags || []).slice(0, 4).map((t, i) => (
                            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full">{t}</span>
                          ))}
                          {(intern.overview.tags || []).length > 4 && (
                            <span className="text-xs text-gray-400">+{intern.overview.tags.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 capitalize">
                        {(intern.eligibility.eligibility.grades || []).join(", ") || "Not specified"}
                      </td>
                      <td className="py-3 px-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingInternship(intern);
                            setOpenDialog(true);
                          }}
                          className="text-sm px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(intern.id)}
                          className="text-sm px-3 py-1 rounded-md bg-red-600/10 hover:bg-red-600/20 text-red-600"
                        >
                          Delete
                        </button>
                        <a
                          href={intern.overview.link || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Open
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { setOpenDialog(false); setTabValue(0); }}
          />
          <div className="relative z-10 w-full max-w-4xl bg-white/90 dark:bg-zinc-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold">{editingInternship?.id ? "Edit Internship" : "Add Internship"}</h3>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                  onClick={() => { setOpenDialog(false); setTabValue(0); }}
                >
                  Cancel
                </button>
                <button
                  className="text-sm px-4 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <nav className="flex gap-2 overflow-x-auto pb-4">
                {["Overview", "Eligibility", "Dates", "Locations", "Costs", "Contact"].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setTabValue(i)}
                    className={`px-3 py-2 rounded-lg text-sm ${tabValue === i ? "bg-indigo-600 text-white" : "bg-white/30 text-gray-700"}`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
                {/* Overview */}
                {tabValue === 0 && (
                  <div className="space-y-4">
                    <input
                      placeholder="Title"
                      className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/60"
                      value={editingInternship?.overview.title || ""}
                      onChange={(e) => setEditingInternship({ ...editingInternship!, overview: { ...editingInternship!.overview, title: e.target.value } })}
                    />
                    <input
                      placeholder="Provider"
                      className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/60"
                      value={editingInternship?.overview.provider || ""}
                      onChange={(e) => setEditingInternship({ ...editingInternship!, overview: { ...editingInternship!.overview, provider: e.target.value } })}
                    />
                    <textarea
                      placeholder="Description"
                      rows={4}
                      className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/60"
                      value={editingInternship?.overview.description || ""}
                      onChange={(e) => setEditingInternship({ ...editingInternship!, overview: { ...editingInternship!.overview, description: e.target.value } })}
                    />
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          placeholder="Add subject"
                          className="flex-1 px-2 py-1 rounded-md border bg-white/60"
                          value={subjectInput}
                          onChange={(e) => setSubjectInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { addToArray("subject", subjectInput); setSubjectInput(""); } }}
                        />
                        <button className="px-3 py-1 rounded-md bg-emerald-500 text-white" onClick={() => { addToArray("subject", subjectInput); setSubjectInput(""); }}>Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingInternship?.overview.subject.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-sm">
                            {s}
                            <button className="ml-2 text-xs text-red-400" onClick={() => removeFromArray("subject", i)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          placeholder="Add tag"
                          className="flex-1 px-2 py-1 rounded-md border bg-white/60"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { addToArray("tags", tagInput); setTagInput(""); } }}
                        />
                        <button className="px-3 py-1 rounded-md bg-indigo-600 text-white" onClick={() => { addToArray("tags", tagInput); setTagInput(""); }}>Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingInternship?.overview.tags.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-sm">
                            {t}
                            <button className="ml-2 text-xs text-red-400" onClick={() => removeFromArray("tags", i)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Eligibility */}
                {tabValue === 1 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <label className="flex flex-col">
                        <span className="text-sm text-gray-600">Essay Required</span>
                        <select
                          className="mt-1 px-2 py-1 rounded-md"
                          value={editingInternship?.eligibility.requirements.essay_required?.toString() || "not provided"}
                          onChange={(e) =>
                            setEditingInternship({
                              ...editingInternship!,
                              eligibility: {
                                ...editingInternship!.eligibility,
                                requirements: {
                                  ...editingInternship!.eligibility.requirements,
                                  essay_required: e.target.value === "not provided" ? "not provided" : e.target.value === "true",
                                },
                              },
                            })
                          }
                        >
                          <option value="not provided">Not Provided</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </label>
                      <label className="flex flex-col">
                        <span className="text-sm text-gray-600">Recommendation</span>
                        <select
                          className="mt-1 px-2 py-1 rounded-md"
                          value={editingInternship?.eligibility.requirements.recommendation_required?.toString() || "not provided"}
                          onChange={(e) =>
                            setEditingInternship({
                              ...editingInternship!,
                              eligibility: {
                                ...editingInternship!.eligibility,
                                requirements: {
                                  ...editingInternship!.eligibility.requirements,
                                  recommendation_required: e.target.value === "not provided" ? "not provided" : e.target.value === "true",
                                },
                              },
                            })
                          }
                        >
                          <option value="not provided">Not Provided</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </label>
                      <label className="flex flex-col">
                        <span className="text-sm text-gray-600">Transcript</span>
                        <select
                          className="mt-1 px-2 py-1 rounded-md"
                          value={editingInternship?.eligibility.requirements.transcript_required?.toString() || "not provided"}
                          onChange={(e) =>
                            setEditingInternship({
                              ...editingInternship!,
                              eligibility: {
                                ...editingInternship!.eligibility,
                                requirements: {
                                  ...editingInternship!.eligibility.requirements,
                                  transcript_required: e.target.value === "not provided" ? "not provided" : e.target.value === "true",
                                },
                              },
                            })
                          }
                        >
                          <option value="not provided">Not Provided</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </label>
                    </div>

                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          placeholder="Add requirement"
                          className="flex-1 px-2 py-1 rounded-md border bg-white/60"
                          value={otherReqInput}
                          onChange={(e) => setOtherReqInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && otherReqInput.trim()) {
                              setEditingInternship({
                                ...editingInternship!,
                                eligibility: {
                                  ...editingInternship!.eligibility,
                                  requirements: {
                                    ...editingInternship!.eligibility.requirements,
                                    other: [...editingInternship!.eligibility.requirements.other, otherReqInput.trim()],
                                  },
                                },
                              });
                              setOtherReqInput("");
                            }
                          }}
                        />
                        <button
                          className="px-3 py-1 rounded-md bg-emerald-500 text-white"
                          onClick={() => {
                            if (otherReqInput.trim()) {
                              setEditingInternship({
                                ...editingInternship!,
                                eligibility: {
                                  ...editingInternship!.eligibility,
                                  requirements: {
                                    ...editingInternship!.eligibility.requirements,
                                    other: [...editingInternship!.eligibility.requirements.other, otherReqInput.trim()],
                                  },
                                },
                              });
                              setOtherReqInput("");
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingInternship?.eligibility.requirements.other.map((req, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/10 rounded-full text-sm">
                            {req}
                            <button className="ml-2 text-xs text-red-400" onClick={() => {
                              const newOther = [...editingInternship.eligibility.requirements.other];
                              newOther.splice(idx, 1);
                              setEditingInternship({
                                ...editingInternship,
                                eligibility: {
                                  ...editingInternship.eligibility,
                                  requirements: { ...editingInternship.eligibility.requirements, other: newOther },
                                },
                              });
                            }}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Minimum age"
                        type="number"
                        className="px-3 py-2 rounded-md"
                        value={editingInternship?.eligibility.eligibility.age.minimum === "not provided" ? "" : editingInternship?.eligibility.eligibility.age.minimum as any}
                        onChange={(e) =>
                          setEditingInternship({
                            ...editingInternship!,
                            eligibility: {
                              ...editingInternship!.eligibility,
                              eligibility: {
                                ...editingInternship!.eligibility.eligibility,
                                age: {
                                  ...editingInternship!.eligibility.eligibility.age,
                                  minimum: e.target.value === "" ? "not provided" : parseInt(e.target.value),
                                },
                              },
                            },
                          })
                        }
                      />
                      <input
                        placeholder="Maximum age"
                        type="number"
                        className="px-3 py-2 rounded-md"
                        value={editingInternship?.eligibility.eligibility.age.maximum === "not provided" ? "" : editingInternship?.eligibility.eligibility.age.maximum as any}
                        onChange={(e) =>
                          setEditingInternship({
                            ...editingInternship!,
                            eligibility: {
                              ...editingInternship!.eligibility,
                              eligibility: {
                                ...editingInternship!.eligibility.eligibility,
                                age: {
                                  ...editingInternship!.eligibility.eligibility.age,
                                  maximum: e.target.value === "" ? "not provided" : parseInt(e.target.value),
                                },
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Dates / Locations / Costs / Contact tabs keep the same internal handlers; use simple inputs similarly */}
                {tabValue === 2 && (
                  <div className="space-y-3">
                    <input
                      placeholder="Duration (weeks)"
                      type="number"
                      className="w-full px-3 py-2 rounded-md"
                      value={editingInternship?.dates.duration_weeks === "not provided" ? "" : editingInternship?.dates.duration_weeks as any}
                      onChange={(e) =>
                        setEditingInternship({
                          ...editingInternship!,
                          dates: { ...editingInternship!.dates, duration_weeks: e.target.value === "" ? "not provided" : parseInt(e.target.value) },
                        })
                      }
                    />
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Deadlines</h4>
                        <button className="px-2 py-1 rounded-md bg-emerald-500 text-white" onClick={addDeadline}>Add</button>
                      </div>
                      <div className="space-y-2">
                        {editingInternship?.dates.deadlines.map((d, idx) => (
                          <div key={idx} className="p-3 rounded-md border bg-white/30 flex gap-2 items-start">
                            <div className="flex-1">
                              <input className="w-full px-2 py-1 rounded-md mb-1" placeholder="Name" value={d.name} onChange={(e) => updateDeadline(idx, "name", e.target.value)} />
                              <input className="w-full px-2 py-1 rounded-md mb-1" placeholder="Term" value={d.term} onChange={(e) => updateDeadline(idx, "term", e.target.value)} />
                              <input className="w-full px-2 py-1 rounded-md" placeholder="Date" value={d.date} onChange={(e) => updateDeadline(idx, "date", e.target.value)} />
                            </div>
                            <div>
                              <button className="text-sm px-2 py-1 rounded-md bg-red-600/10 text-red-600" onClick={() => removeDeadline(idx)}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tabValue === 3 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Locations</h4>
                      <button className="px-2 py-1 rounded-md bg-emerald-500 text-white" onClick={addLocation}>Add</button>
                    </div>
                    {editingInternship?.locations.locations.map((loc, idx) => (
                      <div key={idx} className="p-3 rounded-md border bg-white/30 flex gap-2 items-start">
                        <div className="flex-1 grid sm:grid-cols-3 gap-2">
                          <input className="px-2 py-1 rounded-md" placeholder="State" value={loc.state} onChange={(e) => updateLocation(idx, "state", e.target.value)} />
                          <input className="px-2 py-1 rounded-md" placeholder="City" value={loc.city} onChange={(e) => updateLocation(idx, "city", e.target.value)} />
                          <input className="px-2 py-1 rounded-md" placeholder="Address" value={loc.address} onChange={(e) => updateLocation(idx, "address", e.target.value)} />
                        </div>
                        <div>
                          <button className="text-sm px-2 py-1 rounded-md bg-red-600/10 text-red-600" onClick={() => removeLocation(idx)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tabValue === 4 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Cost Items</h4>
                      <button className="px-2 py-1 rounded-md bg-emerald-500 text-white" onClick={addCost}>Add</button>
                    </div>
                    {editingInternship?.costs.costs.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-md border bg-white/30 flex gap-2 items-start">
                        <div className="flex-1 grid sm:grid-cols-2 gap-2">
                          <input className="px-2 py-1 rounded-md" placeholder="Name" value={c.name} onChange={(e) => updateCost(idx, "name", e.target.value)} />
                          <input className="px-2 py-1 rounded-md" placeholder="Lowest" value={c.lowest as any} onChange={(e) => updateCost(idx, "lowest", e.target.value)} />
                        </div>
                        <div>
                          <button className="text-sm px-2 py-1 rounded-md bg-red-600/10 text-red-600" onClick={() => removeCost(idx)}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <h5 className="font-medium">Stipend</h5>
                      <input className="w-full px-3 py-2 rounded-md" placeholder="Amount" type="number" value={editingInternship?.costs.stipend.amount === "not provided" ? "" : editingInternship?.costs.stipend.amount as any} onChange={(e) => setEditingInternship({ ...editingInternship!, costs: { ...editingInternship!.costs, stipend: { ...editingInternship!.costs.stipend, amount: e.target.value === "" ? "not provided" : parseFloat(e.target.value) } } })} />
                    </div>
                  </div>
                )}

                {tabValue === 5 && (
                  <div className="space-y-3">
                    <input className="w-full px-3 py-2 rounded-md" placeholder="Email" type="email" value={editingInternship?.contact.contact.email || ""} onChange={(e) => setEditingInternship({ ...editingInternship!, contact: { contact: { ...editingInternship!.contact.contact, email: e.target.value } } })} />
                    <input className="w-full px-3 py-2 rounded-md" placeholder="Phone" value={editingInternship?.contact.contact.phone || ""} onChange={(e) => setEditingInternship({ ...editingInternship!, contact: { contact: { ...editingInternship!.contact.contact, phone: e.target.value } } })} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}