import { InternshipCards } from "@/lib/types/internshipCards";
import { UserPreferences } from "@/lib/types/userPreferences";

/** Returns a deadline-proximity score (0–10) for fallback ordering when no prefs exist. */
function deadlineProximityScore(internship: InternshipCards): number {
  const deadlines = internship.dates?.deadlines ?? [];
  if (!deadlines.length) return 0;

  const now = Date.now();
  const futureTimes = deadlines
    .map((d) => {
      if (!d.date || d.date === "not provided") return null;
      const t = new Date(d.date as string).getTime();
      return isNaN(t) ? null : t;
    })
    .filter((t): t is number => t !== null && t > now);

  if (!futureTimes.length) return 0;

  const daysUntil = (Math.min(...futureTimes) - now) / (1000 * 60 * 60 * 24);
  // Penalize deadlines < 3 days out (too soon to act), boost 3–60 days
  if (daysUntil < 3) return 2;
  if (daysUntil < 14) return 10;
  if (daysUntil < 30) return 8;
  if (daysUntil < 60) return 5;
  return 3;
}

export function scoreInternship(
  internship: InternshipCards,
  prefs?: UserPreferences
): number {
  // No prefs yet — fall back to deadline proximity so the list is still useful
  if (!prefs) return deadlineProximityScore(internship);

  let score = 0;

  const userSubjects = prefs.subjects ?? [];
  const userTags = prefs.tags ?? [];
  const userGrades = prefs.preferredGrades ?? [];
  const userStates = prefs.preferredLocation?.states ?? [];
  const userCities = prefs.preferredLocation?.cities ?? [];
  const userVirtual = prefs.preferredLocation?.virtual ?? false;

  // Subject match
  const internshipSubjects: string[] = internship.overview?.subject ?? [];
  if (userSubjects.some((s) => internshipSubjects.includes(s))) {
    score += 3;
  }

  // Tag match
  const internshipTags: string[] = internship.overview?.tags ?? [];
  const matchingTags = internshipTags.filter((tag) => userTags.includes(tag));
  score += matchingTags.length * 2;

  // Grade eligibility
  const internshipGrades = internship.eligibility?.eligibility?.grades ?? [];
  const matchingGrades = internshipGrades.filter((g) => (userGrades as string[]).includes(g));
  score += matchingGrades.length * 2;

  // Location
  for (const loc of internship.locations?.locations ?? []) {
    if (userVirtual && loc.virtual) { score += 2; break; }
    if (loc.state && userStates.includes(loc.state)) { score += 2; break; }
    if (loc.city && userCities.includes(loc.city)) { score += 2; break; }
  }

  // Duration
  const durationWeeks = internship.dates?.duration_weeks;
  if (
    prefs.minDurationWeeks != null &&
    typeof durationWeeks === "number" &&
    durationWeeks >= prefs.minDurationWeeks
  ) {
    score += 1;
  }

  // Stipend
  const stipendAvailable = internship.costs?.stipend?.available ?? false;
  if (prefs.stipendRequired && stipendAvailable) {
    score += 3;
  } else if (prefs.stipendRequired && !stipendAvailable) {
    score -= 5;
  }

  // Blend in deadline proximity so equally-scored items still have useful order
  score += deadlineProximityScore(internship) * 0.1;

  return score;
}
