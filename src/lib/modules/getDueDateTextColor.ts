export function getDueColorClass(days: number | null): string {
  if (days === null) return "text-gray-400";
  if (days <= 0) return "bg-gradient-to-r from-[_#BC3838] to-[_#681E1E] bg-clip-text text-transparent";
  if (days <= 3) return "bg-gradient-to-r from-[_#38A8BC] to-[_#1E4F68] bg-clip-text text-transparent";
  if (days <= 7) return "text-yellow-500";
  return "text-green-600";
}
