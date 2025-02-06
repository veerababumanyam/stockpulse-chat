
export const getRecommendationColor = (recommendation: string) => {
  const lowercaseRec = recommendation.toLowerCase();
  if (lowercaseRec.includes('buy') || lowercaseRec.includes('bullish')) {
    return 'bg-emerald-500 hover:bg-emerald-600';
  }
  if (lowercaseRec.includes('sell') || lowercaseRec.includes('bearish')) {
    return 'bg-red-500 hover:bg-red-600';
  }
  return 'bg-yellow-500 hover:bg-yellow-600';
};

export const getConfidenceColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};
