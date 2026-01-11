export function getIconColor(days: number | null): string {
  if (days === null) return "#9ca3af"; // gray-400 hex
  if (days <= 0) return "#BC3838"; // solid red-ish hex
  if (days <= 3) return "#1E4F68"; // text-red-500 hex
  if (days <= 7) return "#f59e0b"; // text-yellow-500 hex
  return "#16a34a"; // text-green-600 hex
}
