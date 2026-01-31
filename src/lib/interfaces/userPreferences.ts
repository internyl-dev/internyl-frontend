import { Grade } from "./internshipCards";

export interface UserPreferences {
    tags: string[];
    subjects: string[];
    preferredGrades: Grade[];
    preferredLocation: {
        virtual: boolean;
        states: string[];
        cities: string[]; 
    },
    minDurationWeeks: number | null; 
    stipendRequired: boolean;
}