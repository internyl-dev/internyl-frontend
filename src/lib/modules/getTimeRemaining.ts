import type { Timestamp } from "firebase/firestore";
import { parseISO } from "date-fns";

export function robustParseDate(date: Date | Timestamp | string | number | null | undefined): Date | null {
  if (!date) return null;
  // Firebase Timestamp
  if (typeof date === "object" && "toDate" in date) {
    return date.toDate();
  }
  // Already a Date object
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }
  // Unix timestamp (number)
  if (typeof date === "number") {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  }
  // String formats
  if (typeof date === "string") {
    const trimmed = date.trim();
    if (!trimmed || trimmed.toLowerCase() === "not provided") return null;

    let d: Date | null = null;
    // Try ISO 8601 first
    d = parseISO(trimmed);
    if (!isNaN(d.getTime())) return d;

    // Try Date constructor
    d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;

    // Try MM-DD-YYYY
    const dashMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (dashMatch) {
      const [_, mm, dd, yyyy] = dashMatch;
      d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (!isNaN(d.getTime())) return d;
    }

    // Try MM/DD/YYYY
    const usMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (usMatch) {
      const [_, mm, dd, yyyy] = usMatch;
      d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (!isNaN(d.getTime())) return d;
    }

    // Try European format DD.MM.YYYY
    const euMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (euMatch) {
      const [_, dd, mm, yyyy] = euMatch;
      d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (!isNaN(d.getTime())) return d;
    }

    // Try YYYY/MM/DD
    const isoMatch = trimmed.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    if (isoMatch) {
      const [_, yyyy, mm, dd] = isoMatch;
      d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (!isNaN(d.getTime())) return d;
    }

    // Try Month YYYY (e.g., January 2026)
    const monthYearMatch = trimmed.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i);
    if (monthYearMatch) {
      const [_, month, year] = monthYearMatch;
      d = new Date(`${year}-${("0" + (new Date(`${month} 1`).getMonth() + 1)).slice(-2)}-01`);
      if (!isNaN(d.getTime())) return d;
    }

    // If all fails
    return null;
  }
  return null;
}

export function getDaysRemaining(date: Date | Timestamp | string | number | null | undefined): number | null {
  const targetDate = robustParseDate(date);
  if (!targetDate) return null;
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
