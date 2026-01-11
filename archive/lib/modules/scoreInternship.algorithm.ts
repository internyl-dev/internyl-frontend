import { InternshipCards } from "@/lib/types/internshipCards";
import { UserPreferences } from "@/lib/types/userPreferences";

export function scoreInternship(
  internship: InternshipCards,
  prefs?: UserPreferences
): number {
  if (!prefs) return 0;

  let score = 0;

  const userSubjects = prefs.subjects || [];
  const userTags = prefs.tags || [];
  const userGrades = prefs.preferredGrades || [];
  const userStates = prefs.preferredLocation?.states || [];
  const userCities = prefs.preferredLocation?.cities || [];
  const userVirtual = prefs.preferredLocation?.virtual || false;

  // Subject
  if (
    userSubjects.some(subject => internship.overview.subject.includes(subject))
  ) {
    score += 3;
  }

  // Tags
  const matchingTags = internship.overview.tags?.filter(tag =>
    userTags.includes(tag)
  );
  score += (matchingTags?.length || 0) * 2;

  // Grade eligibility
  const matchingGrades = internship.eligibility.eligibility.grades?.filter(grade =>
    userGrades.includes(grade)
  );
  score += (matchingGrades?.length || 0) * 2;

  // Location
  for (const loc of internship.locations.locations || []) {
    if (userVirtual && loc.virtual) {
      score += 2;
      break;
    }
    if (userStates.includes(loc.state)) {
      score += 2;
      break;
    }
    if (userCities.includes(loc.city)) {
      score += 2;
      break;
    }
  }

  // Duration
  if (
    prefs.minDurationWeeks != null &&
    internship.dates.duration_weeks != null &&
    typeof internship.dates.duration_weeks === "number" &&
    internship.dates.duration_weeks >= prefs.minDurationWeeks
  ) {
    score += 1;
  }


  // Stipend
  if (prefs.stipendRequired && internship.costs.stipend.available) {
    score += 3;
  } else if (prefs.stipendRequired && !internship.costs.stipend.available) {
    score -= 5;
  }

  return score;
}
