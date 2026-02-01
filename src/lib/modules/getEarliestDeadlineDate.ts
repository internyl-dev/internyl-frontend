import { Deadline } from "../interfaces/internshipCards";

export function getEarliestDeadlineDate(deadlines: Deadline[]): Date | null {
    if (!deadlines || deadlines.length === 0) return null;

    const validDates = deadlines
      .map((d) => (d.date && d.date !== "not provided" ? new Date(d.date) : null))
      .filter((date): date is Date => !!date && !isNaN(date.getTime()));

    if (validDates.length === 0) return null;

    return validDates.reduce((earliest, current) =>
      current < earliest ? current : earliest
    );
  }