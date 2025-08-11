import { format } from 'date-fns';
import { robustParseDate } from './getTimeRemaining';

/**
 * Safely parses and formats a date string to 'MMM d, yyyy' (e.g., Aug 11, 2025).
 * Returns 'Invalid date' if parsing fails.
 */
export function formatDate(dateStr: string | number | Date | null | undefined, dateFormat = 'MMM d, yyyy'): string {
  const dateObj = robustParseDate(dateStr);
  if (!dateObj) return 'Not provided';
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  try {
    return format(dateObj, dateFormat);
  } catch {
    return 'Invalid date';
  }
}
