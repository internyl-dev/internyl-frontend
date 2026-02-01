import { InternshipCards as InternshipType } from "../interfaces/internshipCards";
import { capitalizeWords } from "./capitalizeWords";
import { formatDate } from "./dateUtils";
import { isTruthyValue } from "./isTruthyValue";
import { isValidValue } from "./isValidValue";
// Function to get additional info not displayed on card
export const getAdditionalInfo = (internship: InternshipType) => {
    const info: { label: string; value: string }[] = [];

    // Description - most important, shown first
    if (isValidValue(internship.overview?.description)) {
        info.push({
            label: "Description",
            value: internship.overview.description
        });
    }

    // Location information
    if (internship.locations?.locations && Array.isArray(internship.locations.locations)) {
        const location = internship.locations.locations[0];
        if (location) {
            const locationParts = [];
            if (isValidValue(location.city)) {
                locationParts.push(location.city);
            }
            if (isValidValue(location.state)) {
                locationParts.push(location.state);
            }
            if (isValidValue(location.virtual)) {
                locationParts.push(`Virtual: ${location.virtual}`);
            }
            if (isValidValue(location.address)) {
                locationParts.push(location.address);
            }

            if (locationParts.length > 0) {
                info.push({
                    label: "Location",
                    value: locationParts.join(", ")
                });
            }
        }
    }

    // Tags (online, hybrid, in-person)
    if (internship.overview?.tags && Array.isArray(internship.overview.tags)) {
        const validTags = internship.overview.tags.filter(tag => isValidValue(tag));
        if (validTags.length > 0) {
            info.push({
                label: "Format",
                value: validTags.map(tag => capitalizeWords(tag)).join(", ")
            });
        }
    }

    // All deadlines with details
    if (internship.dates?.deadlines && Array.isArray(internship.dates.deadlines)) {
        const deadlines = internship.dates.deadlines
            .filter(deadline => isValidValue(deadline.name))
            .map(deadline => {
                let deadlineStr = deadline.name;
                if (isValidValue(deadline.date)) {
                    deadlineStr += `: ${formatDate(deadline.date)}`;
                }
                if (isValidValue(deadline.priority)) {
                    deadlineStr += ` (${deadline.priority} priority)`;
                }
                if (isValidValue(deadline.term)) {
                    deadlineStr += ` - ${deadline.term}`;
                }
                return deadlineStr;
            });
        if (deadlines.length > 0) {
            info.push({
                label: deadlines.length === 1 ? "Deadline" : "Deadlines",
                value: deadlines.join(" • ")
            });
        }
    }

    // Program dates
    if (internship.dates?.dates && Array.isArray(internship.dates.dates)) {
        const programDates = internship.dates.dates
            .filter(dateItem => isValidValue(dateItem.term))
            .map(dateItem => {
                let dateStr = dateItem.term;
                if (isValidValue(dateItem.start) && isValidValue(dateItem.end)) {
                    const startDate = formatDate(dateItem.start);
                    const endDate = formatDate(dateItem.end);
                    dateStr += `: ${startDate} - ${endDate}`;
                }
                return dateStr;
            });
        if (programDates.length > 0) {
            info.push({
                label: "Program Dates",
                value: programDates.join(" • ")
            });
        }
    }

    // Eligibility requirements from "other" array
    if (internship.eligibility?.requirements?.other && Array.isArray(internship.eligibility.requirements.other)) {
        const requirements = internship.eligibility.requirements.other
            .filter(req => isValidValue(req));
        if (requirements.length > 0) {
            info.push({
                label: "Requirements",
                value: requirements.join(" • ")
            });
        }
    }

    // Application requirements
    const appRequirements = [];
    if (isTruthyValue(internship.eligibility?.requirements?.essay_required)) {
        appRequirements.push("Essay required");
    }
    if (isTruthyValue(internship.eligibility?.requirements?.recommendation_required)) {
        appRequirements.push("Recommendation required");
    }
    if (isTruthyValue(internship.eligibility?.requirements?.transcript_required)) {
        appRequirements.push("Transcript required");
    }

    if (appRequirements.length > 0) {
        info.push({
            label: "Application Requirements",
            value: appRequirements.join(" • ")
        });
    }

    // Cost details (for modal):
    if (internship.costs?.costs && Array.isArray(internship.costs.costs) && internship.costs.costs[0]) {
        const costInfo = internship.costs.costs[0];
        let costStr = "";
        if (isTruthyValue(costInfo.free)) {
            costStr = "Free program";
        } else {
            const costParts = [];
            if (isValidValue(costInfo.lowest) && isValidValue(costInfo.highest)) {
                if (costInfo.lowest === costInfo.highest) {
                    costParts.push(`$${costInfo.lowest}`);
                } else {
                    costParts.push(`$${costInfo.lowest} - $${costInfo.highest}`);
                }
            } else if (isValidValue(costInfo.lowest)) {
                costParts.push(`Starting at $${costInfo.lowest}`);
            } else if (isValidValue(costInfo.highest)) {
                costParts.push(`Up to $${costInfo.highest}`);
            }
            if (costParts.length > 0) {
                costStr = costParts.join(", ");
            }
        }
        if (isTruthyValue(costInfo["financial-aid-available"])) {
            costStr += (costStr ? " • " : "") + "Financial aid available";
        }
        if (costStr) {
            info.push({
                label: "Program Cost",
                value: costStr
            });
        }
    }

    // Contact information
    if (internship.contact?.contact) {
        const contactInfo = [];
        if (isValidValue(internship.contact.contact.email)) {
            contactInfo.push(`Email: ${internship.contact.contact.email}`);
        }
        if (isValidValue(internship.contact.contact.phone)) {
            contactInfo.push(`Phone: ${internship.contact.contact.phone}`);
        }

        if (contactInfo.length > 0) {
            info.push({
                label: "Contact",
                value: contactInfo.join(" • ")
            });
        }
    }

    return info;
};