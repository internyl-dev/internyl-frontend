import { parseISO, format } from 'date-fns';

/**
 * Safely parses and formats a date string to 'MMM d, yyyy' (e.g., Aug 11, 2025).
 * Returns 'Invalid date' if parsing fails.
 */
export function formatDate(dateStr: string | number | Date | null | undefined, dateFormat = 'MMM d, yyyy'): string {
  if (!dateStr) return 'Not provided';
  let dateObj: Date;
  if (typeof dateStr === 'string') {
    // Try ISO parse, fallback to Date constructor
    try {
      dateObj = parseISO(dateStr);
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date(dateStr);
      }
    } catch {
      dateObj = new Date(dateStr);
    }
  } else if (typeof dateStr === 'number') {
    dateObj = new Date(dateStr);
  } else if (dateStr instanceof Date) {
    dateObj = dateStr;
  } else {
    return 'Not provided';
  }
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  return format(dateObj, dateFormat);
}
