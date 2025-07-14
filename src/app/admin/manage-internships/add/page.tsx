"use client";

import React, { useState } from "react";
import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Chip,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { db } from "@/lib/config/firebaseConfig";
import { collection, setDoc, doc, Timestamp } from "firebase/firestore";

import type { InternshipCards, Deadline, Eligibility, Location, DateRange, Stipend, Requirements } from "@/lib/types/internshipCards";

const gradesOptions = [
  "freshman",
  "sophomore",
  "junior",
  "senior",
  "undergraduate",
  "not provided",
];

const priorityOptions = ["high", "medium", "low", "none"];

const terms = ["spring", "summer", "fall", "winter", "not provided"];

const times = ["morning", "afternoon", "evening", "not provided"];

export default function AddInternshipPage() {
  const router = useRouter();

  // Form state for the main internship fields
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [durationWeeks, setDurationWeeks] = useState<number | "">("");
  const [cost, setCost] = useState<string>("free");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Deadline example (simplified, just one for demo)
  const [deadlineName, setDeadlineName] = useState("Application Deadline");
  const [deadlinePriority, setDeadlinePriority] = useState<Deadline["priority"]>("high");
  const [deadlineDate, setDeadlineDate] = useState<string>("");
  const [deadlineRolling, setDeadlineRolling] = useState(false);
  const [deadlineTime, setDeadlineTime] = useState("not provided");

  // Eligibility (simplified)
  const [eligibilityRising, setEligibilityRising] = useState(false);
  const [eligibilityGrades, setEligibilityGrades] = useState<string[]>([]);
  const [eligibilityAgeMin, setEligibilityAgeMin] = useState<number | "">("");
  const [eligibilityAgeMax, setEligibilityAgeMax] = useState<number | "">("");

  // Location (one only for demo)
  const [locationVirtual, setLocationVirtual] = useState(false);
  const [locationState, setLocationState] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationAddress, setLocationAddress] = useState("");

  // Dates (one only for demo)
  const [dateTerm, setDateTerm] = useState("not provided");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  // Stipend
  const [stipendAvailable, setStipendAvailable] = useState(false);
  const [stipendAmount, setStipendAmount] = useState<number | "">("");

  // Requirements
  const [essayRequired, setEssayRequired] = useState(false);
  const [recommendationRequired, setRecommendationRequired] = useState(false);
  const [transcriptRequired, setTranscriptRequired] = useState(false);
  const [requirementsOther, setRequirementsOther] = useState<string>("");

  // Contact
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Handle adding tags quickly
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  // Helper to convert form data to your InternshipCards type
  const prepareInternshipData = (): InternshipCards => {
    return {
      id: title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      title,
      provider: provider || "not provided",
      description,
      deadlines: [
        {
          name: deadlineName,
          priority: deadlinePriority,
          date: deadlineDate ? new Date(deadlineDate) : null,
          rollingBasis: deadlineRolling,
          time: deadlineTime,
        },
      ],
      subject: subject || "not provided",
      eligibility: {
        rising: eligibilityRising,
        grades: eligibilityGrades.length ? (eligibilityGrades as any) : ["not provided"],
        age: {
          minimum: eligibilityAgeMin === "" ? null : eligibilityAgeMin,
          maximum: eligibilityAgeMax === "" ? null : eligibilityAgeMax,
        },
      },
      location: [
        {
          virtual: locationVirtual,
          state: locationState || "not provided",
          city: locationCity || "not provided",
          address: locationAddress || "not provided",
        },
      ],
      dates: [
        {
          term: dateTerm,
          start: dateStart ? new Date(dateStart) : null,
          end: dateEnd ? new Date(dateEnd) : null,
        },
      ],
      duration_weeks: durationWeeks === "" ? null : durationWeeks,
      cost: cost || "not provided",
      stipend: {
        available: stipendAvailable,
        amount: stipendAvailable
          ? stipendAmount === ""
            ? null
            : stipendAmount
          : null,
      },
      requirements: {
        essay_required: essayRequired,
        recommendation_required: recommendationRequired,
        transcript_required: transcriptRequired,
        other: requirementsOther
          ? requirementsOther.split(",").map((s) => s.trim())
          : ["not provided"],
      },
      tags,
      link,
      contact: {
        email: contactEmail || "not provided",
        phone: contactPhone || "not provided",
      },
    };
  };

  const handleSubmit = async () => {
    try {
      const internshipData = prepareInternshipData();
      await setDoc(doc(db, "internships", internshipData.id), internshipData);
      alert("Internship added successfully!");
      router.push("/admin/manage-internships");
    } catch (error) {
      alert("Error adding internship. Check console.");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Box
        component="form"
        sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2, bgcolor: "white", p: 6 }}
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Typography variant="h4" mb={3}>
          Add New Internship
        </Typography>

        {/* Title */}
        <TextField
          fullWidth
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        {/* Provider */}
        <TextField
          fullWidth
          label="Provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          margin="normal"
          helperText="If none, will be 'not provided'"
        />

        {/* Description */}
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
        />

        {/* Subject */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
          helperText="e.g. Computer Science, History"
        />

        {/* Duration */}
        <TextField
          fullWidth
          label="Duration (weeks)"
          type="number"
          value={durationWeeks}
          onChange={(e) => setDurationWeeks(e.target.value === "" ? "" : Number(e.target.value))}
          margin="normal"
          inputProps={{ min: 0 }}
        />

        {/* Cost */}
        <TextField
          fullWidth
          label="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          margin="normal"
          helperText="e.g. free, 100, not provided"
        />

        {/* Link */}
        <TextField
          fullWidth
          label="Application Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          margin="normal"
        />

        {/* Tags input */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 1, mb: 2 }}>
          <TextField
            label="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            size="small"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button variant="outlined" onClick={handleAddTag} size="small">
            Add
          </Button>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} onDelete={() => setTags(tags.filter((t) => t !== tag))} />
            ))}
          </Box>
        </Box>

        {/* DEADLINE */}
        <Typography variant="h6" mt={4} mb={1}>
          Deadline
        </Typography>

        <TextField
          fullWidth
          label="Deadline Name"
          value={deadlineName}
          onChange={(e) => setDeadlineName(e.target.value)}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            value={deadlinePriority}
            label="Priority"
            onChange={(e) => setDeadlinePriority(e.target.value as Deadline["priority"])}
          >
            {priorityOptions.map((p) => (
              <MenuItem key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Deadline Date"
          type="date"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={deadlineRolling}
              onChange={(e) => setDeadlineRolling(e.target.checked)}
            />
          }
          label="Rolling Basis"
          sx={{ mt: 1 }}
        />

        <TextField
          fullWidth
          label="Deadline Time"
          select
          value={deadlineTime}
          onChange={(e) => setDeadlineTime(e.target.value)}
          margin="normal"
        >
          {times.map((t) => (
            <MenuItem key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        {/* ELIGIBILITY */}
        <Typography variant="h6" mt={4} mb={1}>
          Eligibility
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={eligibilityRising}
              onChange={(e) => setEligibilityRising(e.target.checked)}
            />
          }
          label="Rising"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Grades</InputLabel>
          <Select
            multiple
            value={eligibilityGrades}
            onChange={(e) =>
              setEligibilityGrades(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              )
            }
            input={<OutlinedInput label="Grades" />}
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {gradesOptions.map((grade) => (
              <MenuItem key={grade} value={grade}>
                {grade.charAt(0).toUpperCase() + grade.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Minimum Age"
            type="number"
            value={eligibilityAgeMin}
            onChange={(e) =>
              setEligibilityAgeMin(e.target.value === "" ? "" : Number(e.target.value))
            }
            margin="normal"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Maximum Age"
            type="number"
            value={eligibilityAgeMax}
            onChange={(e) =>
              setEligibilityAgeMax(e.target.value === "" ? "" : Number(e.target.value))
            }
            margin="normal"
            sx={{ flex: 1 }}
          />
        </Stack>

        {/* LOCATION */}
        <Typography variant="h6" mt={4} mb={1}>
          Location
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={locationVirtual}
              onChange={(e) => setLocationVirtual(e.target.checked)}
            />
          }
          label="Virtual"
        />

        <TextField
          fullWidth
          label="State"
          value={locationState}
          onChange={(e) => setLocationState(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="City"
          value={locationCity}
          onChange={(e) => setLocationCity(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address"
          value={locationAddress}
          onChange={(e) => setLocationAddress(e.target.value)}
          margin="normal"
        />

        {/* DATES */}
        <Typography variant="h6" mt={4} mb={1}>
          Dates
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Term</InputLabel>
          <Select
            value={dateTerm}
            label="Term"
            onChange={(e) => setDateTerm(e.target.value)}
          >
            {terms.map((term) => (
              <MenuItem key={term} value={term}>
                {term.charAt(0).toUpperCase() + term.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Start Date"
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Stack>

        {/* STIPEND */}
        <Typography variant="h6" mt={4} mb={1}>
          Stipend
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={stipendAvailable}
              onChange={(e) => setStipendAvailable(e.target.checked)}
            />
          }
          label="Available"
        />

        {stipendAvailable && (
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={stipendAmount}
            onChange={(e) =>
              setStipendAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            margin="normal"
            inputProps={{ min: 0 }}
          />
        )}

        {/* REQUIREMENTS */}
        <Typography variant="h6" mt={4} mb={1}>
          Requirements
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={essayRequired}
              onChange={(e) => setEssayRequired(e.target.checked)}
            />
          }
          label="Essay Required"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={recommendationRequired}
              onChange={(e) =>
                setRecommendationRequired(e.target.checked)
              }
            />
          }
          label="Recommendation Required"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={transcriptRequired}
              onChange={(e) => setTranscriptRequired(e.target.checked)}
            />
          }
          label="Transcript Required"
        />

        <TextField
          fullWidth
          label="Other Requirements (comma separated)"
          value={requirementsOther}
          onChange={(e) => setRequirementsOther(e.target.value)}
          margin="normal"
        />

        {/* CONTACT */}
        <Typography variant="h6" mt={4} mb={1}>
          Contact Information
        </Typography>

        <TextField
          fullWidth
          label="Contact Email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contact Phone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          margin="normal"
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4} mb={4}>
          <Button variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Add Internship
          </Button>
        </Stack>
      </Box>
    </AdminLayout>
  );
}
