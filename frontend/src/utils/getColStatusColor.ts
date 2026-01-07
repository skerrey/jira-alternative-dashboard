// Get column status color
export const getColStatusColor = (statusName: string) => {
  const lowerName = statusName.toLowerCase();
  
  // Done - Green (completed)
  if (lowerName.includes("done") || lowerName.includes("complete")) {
    return "bg-green-100 border-green-300 text-green-800";
  }
  
  // Ready for Deploy - Cyan/Teal (ready to go)
  if (lowerName.includes("ready for deploy") || lowerName.includes("ready to deploy")) {
    return "bg-cyan-100 border-cyan-300 text-cyan-800";
  }
  
  // UAT - Purple (user acceptance testing)
  if (lowerName.includes("uat")) {
    return "bg-purple-100 border-purple-300 text-purple-800";
  }
  
  // Testing - Yellow/Orange (testing phase)
  if (lowerName.includes("testing")) {
    return "bg-yellow-100 border-yellow-300 text-yellow-800";
  }
  
  // In Dev - Blue (in progress)
  if (lowerName.includes("in dev") || lowerName.includes("development")) {
    return "bg-blue-100 border-blue-300 text-blue-800";
  }
  
  // To Do - Gray (not started)
  if (lowerName.includes("todo") || lowerName.includes("to do")) {
    return "bg-gray-100 border-gray-300 text-gray-800";
  }
  
  // Default fallback
  return "bg-gray-100 border-gray-300 text-gray-800";
};