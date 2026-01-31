import { Timestamp } from "firebase/firestore";

// Helper to safely convert Firestore Timestamp to JS Date
export function toDateIfTimestamp(value: Date | Timestamp | null | undefined): Date | null {
    if (value && typeof (value as Timestamp).toDate === "function") {
        return (value as Timestamp).toDate();
    }
    if (value instanceof Date) {
        return value;
    }
    return null;
}