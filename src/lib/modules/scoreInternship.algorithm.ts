import { InternshipCards } from "@/lib/types/internshipCards";
import { UserPreferences } from "@/lib/types/userPreferences";

export function scoreInternship(
  internship: InternshipCards,
  prefs?: UserPreferences
): number {
  if (!prefs) return 0;

  let score = 0;

  // Subject
  if (prefs.subjects?.includes(internship.subject)) {
    score += 3;
  }

  // Tags
  const matchingTags = internship.tags?.filter(tag =>
    prefs.tags.includes(tag)
  );
  score += (matchingTags?.length || 0) * 2;

  // Grade eligibility
  const matchingGrades = internship.eligibility.grades?.filter(grade =>
    prefs.preferredGrades.includes(grade)
  );
  score += (matchingGrades?.length || 0) * 2;

  // Location
  for (const loc of internship.location || []) {
    if (prefs.preferredLocation.virtual && loc.virtual) {
      score += 2;
      break;
    }
    if (prefs.preferredLocation.states.includes(loc.state)) {
      score += 2;
      break;
    }
    if (prefs.preferredLocation.cities.includes(loc.city)) {
      score += 2;
      break;
    }
  }

  // Duration
  if (
    prefs.minDurationWeeks != null &&
    internship.duration_weeks != null &&
    internship.duration_weeks >= prefs.minDurationWeeks
  ) {
    score += 1;
  }

  // Stipend
  if (prefs.stipendRequired && internship.stipend.available) {
    score += 3;
  } else if (prefs.stipendRequired && !internship.stipend.available) {
    score -= 5;
  }

  return score;
}
