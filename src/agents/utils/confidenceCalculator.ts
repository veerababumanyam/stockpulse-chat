
export const calculateConfidenceScore = (indicators: any, trends: string[]): number => {
  let score = 70; // Base confidence score

  // Adjust based on data quality and completeness
  if (indicators.gdp && indicators.inflation && indicators.unemployment) score += 10;
  if (indicators.marketCap && indicators.peRatio && indicators.debtToEquity) score += 5;
  if (indicators.volume && indicators.priceHistory) score += 5;
  
  // Adjust based on trend alignment
  if (trends.length >= 3) score += 5;
  if (trends.includes('Economic Expansion')) score += 5;
  if (trends.includes('Rising Inflation')) score -= 5;
  if (trends.includes('Market Volatility')) score -= 5;
  if (trends.includes('Strong Technicals')) score += 5;

  return Math.min(100, Math.max(0, score));
};

export const generateSummary = (indicators: any, trends: string[]): string => {
  const gdpGrowth = indicators.gdp?.growth || 0;
  const inflation = indicators.inflation?.value || 0;
  const marketTrend = trends.includes('Bullish') ? 'positive' : 
                     trends.includes('Bearish') ? 'negative' : 'neutral';

  if (gdpGrowth > 2 && inflation < 3 && marketTrend === 'positive') {
    return 'Strong economic conditions supporting market growth';
  } else if (gdpGrowth > 0 && inflation < 5 && marketTrend !== 'negative') {
    return 'Moderate economic growth with manageable inflation';
  } else if (gdpGrowth < 0 || inflation > 5) {
    return 'Economic challenges signal caution';
  }
  return 'Mixed economic signals suggest careful positioning';
};

export const generateRecommendation = (impact: any, confidence: number): string => {
  if (impact.marketConditions === 'Very Favorable' && confidence > 75) {
    return 'Strong Buy - Optimal Market Conditions';
  } else if (impact.marketConditions === 'Favorable' && confidence > 65) {
    return 'Buy - Positive Market Environment';
  } else if (impact.marketConditions === 'Very Challenging' && confidence > 75) {
    return 'Strong Sell - Adverse Market Conditions';
  } else if (impact.marketConditions === 'Challenging' && confidence > 65) {
    return 'Sell - Negative Market Environment';
  }
  return 'Hold - Mixed Market Signals';
};

export const calculatePricePrediction = (
  currentPrice: number,
  growth: number,
  confidence: number,
  monthsAhead: number
): { price: number; confidence: number } => {
  const monthlyGrowth = growth / 12;
  const projectedGrowth = monthlyGrowth * monthsAhead;
  const projectedPrice = currentPrice * (1 + projectedGrowth);
  const predictionConfidence = Math.max(30, confidence - (monthsAhead * 0.5));

  return {
    price: Number(projectedPrice.toFixed(2)),
    confidence: Number(predictionConfidence.toFixed(2))
  };
};
