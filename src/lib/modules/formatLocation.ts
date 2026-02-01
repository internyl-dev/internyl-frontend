import { InternshipCards as InternshipType } from "@/lib/interfaces/internshipCards";
import { isValidValue } from "./isValidValue";

// Function to format location information
export const formatLocation = (internship: InternshipType): string => {
    if (internship.locations?.locations && Array.isArray(internship.locations.locations)) {
        const location = internship.locations.locations[0];
        if (location) {
            const locationParts = [];

            // Add physical location parts first
            if (isValidValue(location.city)) {
                locationParts.push(location.city);
            }
            if (isValidValue(location.state)) {
                locationParts.push(location.state);
            }
            if (isValidValue(location.address)) {
                locationParts.push(location.address);
            }

            // Handle virtual field
            if (isValidValue(location.virtual)) {
                // If there's already a physical location, don't override it
                if (locationParts.length === 0) {
                    const virtualValue = location.virtual.toString().toLowerCase();
                    if (virtualValue === 'true' || virtualValue === 'yes') {
                        locationParts.push("Virtual");
                    } else if (virtualValue === 'false' || virtualValue === 'no') {
                        locationParts.push("In person");
                    } else if (virtualValue === 'both available' || virtualValue === 'hybrid') {
                        locationParts.push("Virtual & In person");
                    } else {
                        locationParts.push(`Virtual: ${location.virtual}`);
                    }
                }
            }

            if (locationParts.length > 0) {
                return locationParts.join(", ");
            }
        }
    }
    return "Location not provided";
};