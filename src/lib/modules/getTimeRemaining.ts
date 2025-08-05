import type { Timestamp } from "firebase/firestore";

export function getDaysRemaining(date: Date | Timestamp | null | undefined): number | null {
  if (!date) return null;

  // Convert Firebase Timestamp to Date if needed
  const targetDate = "toDate" in date ? date.toDate() : date;

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
