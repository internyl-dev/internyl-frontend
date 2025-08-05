export function getDaysRemaining(date: any): number | null {
  if (!date) return null;

  // Convert Firebase Timestamp to Date if needed
  const targetDate = date.toDate ? date.toDate() : date;

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
