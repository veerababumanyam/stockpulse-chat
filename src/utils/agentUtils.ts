
// Generate agent ID from class name
export const generateAgentId = (className: string) => {
  return className.replace(/Agent$/, "").replace(/([A-Z])/g, "-$1").toLowerCase().slice(1);
};

// Generate agent name from class name
export const generateAgentName = (className: string) => {
  return className.replace(/Agent$/, "").replace(/([A-Z])/g, " $1").trim();
};

// Generate description based on name
export const generateDescription = (name: string) => {
  return `${name} specializing in ${name.toLowerCase()} analysis and insights`;
};
