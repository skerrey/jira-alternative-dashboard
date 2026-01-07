// Get priority color
export const getPriorityColor = (priorityName: string) => {
  const lowerName = priorityName.toLowerCase();
  if (lowerName.includes("highest") || lowerName.includes("critical")) {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (lowerName.includes("high")) {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }
  if (lowerName.includes("medium") || lowerName.includes("normal")) {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  if (lowerName.includes("low") || lowerName.includes("lowest")) {
    return "bg-green-100 text-green-700 border-green-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};