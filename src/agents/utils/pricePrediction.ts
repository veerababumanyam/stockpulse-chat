
export const generatePricePrediction = (currentPrice: number, months: number, confidence: number): {
  price: number;
  confidence: number;
} => {
  const volatility = 0.2; // 20% annual volatility
  const monthlyVolatility = volatility / Math.sqrt(12);
  const randomFactor = 1 + (Math.random() - 0.5) * monthlyVolatility * months;
  const trendFactor = 1 + (months / 12) * 0.08; // Assuming 8% annual trend

  return {
    price: Number((currentPrice * randomFactor * trendFactor).toFixed(2)),
    confidence: Number((confidence - (months * 2)).toFixed(2)) // Confidence decreases with time
  };
};

export const calculatePriceImpact = (currentPrice: number, macroImpact: number): any => {
  const impactPercentage = macroImpact * 5; // Each impact point represents 5% potential price movement
  const priceChange = currentPrice * (impactPercentage / 100);
  
  return {
    direction: macroImpact > 0 ? 'Positive' : 'Negative',
    percentage: Math.abs(impactPercentage).toFixed(2) + '%',
    potentialPrice: (currentPrice + priceChange).toFixed(2)
  };
};

