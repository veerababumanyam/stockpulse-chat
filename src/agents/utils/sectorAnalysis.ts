
export const analyzeSectorPerformance = (sectorData: any): any => {
  if (!sectorData?.sectorPerformance) return {};

  const sectors = sectorData.sectorPerformance;
  const positiveCount = sectors.filter((s: any) => parseFloat(s.changesPercentage) > 0).length;
  const marketStrength = (positiveCount / sectors.length) * 100;

  return {
    marketStrength: marketStrength.toFixed(2) + '%',
    leadingSectors: getTopPerformers(sectors, 3),
    laggingSectors: getBottomPerformers(sectors, 3),
    overallTrend: determineTrend(marketStrength)
  };
};

export const getTopPerformers = (sectors: any[], count: number): any[] => {
  return sectors
    .sort((a, b) => parseFloat(b.changesPercentage) - parseFloat(a.changesPercentage))
    .slice(0, count)
    .map(s => ({
      sector: s.sector,
      performance: parseFloat(s.changesPercentage).toFixed(2) + '%'
    }));
};

export const getBottomPerformers = (sectors: any[], count: number): any[] => {
  return sectors
    .sort((a, b) => parseFloat(a.changesPercentage) - parseFloat(b.changesPercentage))
    .slice(0, count)
    .map(s => ({
      sector: s.sector,
      performance: parseFloat(s.changesPercentage).toFixed(2) + '%'
    }));
};

export const determineTrend = (marketStrength: number): string => {
  if (marketStrength > 70) return 'Strong Bullish';
  if (marketStrength > 50) return 'Moderately Bullish';
  if (marketStrength > 30) return 'Moderately Bearish';
  return 'Strong Bearish';
};

export const calculateAveragePerformance = (sectors: any[]): number => {
  if (!sectors.length) return 0;
  return sectors.reduce((sum: number, sector: any) => 
    sum + parseFloat(sector.changesPercentage), 0) / sectors.length;
};

export const identifySectorTrends = (sectorData: any): string[] => {
  if (!sectorData?.sectorPerformance) return [];

  const trends = [];
  const sectors = sectorData.sectorPerformance;
  
  const cyclicals = sectors.filter((s: any) => 
    s.sector.includes('Consumer') || s.sector.includes('Industrial')
  );
  const defensive = sectors.filter((s: any) => 
    s.sector.includes('Utilities') || s.sector.includes('Healthcare')
  );

  const cyclicalAvg = calculateAveragePerformance(cyclicals);
  const defensiveAvg = calculateAveragePerformance(defensive);

  if (cyclicalAvg > defensiveAvg) {
    trends.push('Risk-on market environment');
  } else {
    trends.push('Defensive market positioning');
  }

  return trends;
};

