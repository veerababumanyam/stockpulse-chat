
export const extractRecommendationsFromData = (data: any[]): any[] => {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map(item => ({
    analyst: item.analystName || 'Unknown Analyst',
    source: item.site || 'Financial Institution',
    recommendation: item.recommendation || 'N/A',
    targetPrice: item.targetPrice,
    date: new Date(item.date).toISOString().split('T')[0]
  }));
};

export const processAnalystRecommendations = (recommendations: any[], symbol: string): string[] => {
  if (!Array.isArray(recommendations)) return [];

  const recommendedStocks = new Set<string>([symbol]);
  recommendations.forEach(rec => {
    if (rec.recommendation?.toLowerCase().includes('buy')) {
      recommendedStocks.add(symbol);
    }
  });

  return Array.from(recommendedStocks);
};

export const combineRecommendations = (analystRecs: string[], newsRecs: string[]): string[] => {
  const allRecs = new Set([...analystRecs, ...newsRecs]);
  return Array.from(allRecs);
};

