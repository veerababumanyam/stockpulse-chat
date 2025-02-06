
export const calculateConfidenceScore = (indicators: any, trends: string[]): number => {
  let score = 70; // Base confidence score

  // Adjust based on data quality and trends
  if (indicators.gdp && indicators.inflation && indicators.unemployment) score += 10;
  if (trends.length >= 3) score += 10;
  if (trends.includes('Economic Expansion')) score += 5;
  if (trends.includes('Rising Inflation')) score -= 5;

  return Math.min(100, Math.max(0, score));
};

export const generateSummary = (indicators: any, trends: string[]): string => {
  const gdpGrowth = indicators.gdp?.growth || 0;
  const inflation = indicators.inflation?.value || 0;

  if (gdpGrowth > 2 && inflation < 3) {
    return 'Strong economic conditions supporting market growth';
  } else if (gdpGrowth > 0 && inflation < 5) {
    return 'Moderate economic growth with manageable inflation';
  } else if (gdpGrowth < 0) {
    return 'Economic contraction signals caution';
  }
  return 'Mixed economic signals suggest careful positioning';
};

export const generateRecommendation = (impact: any, confidence: number): string => {
  if (impact.marketConditions === 'Very Favorable' && confidence > 70) {
    return 'Strong Buy - Optimal Economic Conditions';
  } else if (impact.marketConditions === 'Favorable' && confidence > 60) {
    return 'Buy - Positive Economic Environment';
  } else if (impact.marketConditions === 'Very Challenging' && confidence > 70) {
    return 'Strong Sell - Adverse Economic Conditions';
  } else if (impact.marketConditions === 'Challenging' && confidence > 60) {
    return 'Sell - Negative Economic Environment';
  }
  return 'Hold - Mixed Economic Signals';
};

