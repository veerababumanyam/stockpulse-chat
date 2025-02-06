
export const calculateGDPGrowth = (data: any[]): number => {
  const gdpData = data.filter(d => d.indicator === 'GDP')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (gdpData.length < 2) return 0;
  
  const latest = Number(gdpData[0].value);
  const previous = Number(gdpData[1].value);
  return ((latest - previous) / previous) * 100;
};

export const assessMacroImpact = (economicData: any[], sectorData: any): number => {
  const gdpGrowth = calculateGDPGrowth(economicData);
  const inflationRate = findLatestValue(economicData, 'CPI');
  const unemploymentRate = findLatestValue(economicData, 'UNEMPLOYMENT');
  
  let impact = 0;
  impact += gdpGrowth > 2 ? 1 : gdpGrowth > 0 ? 0.5 : -0.5;
  impact += inflationRate < 3 ? 1 : inflationRate < 5 ? 0 : -1;
  impact += unemploymentRate < 5 ? 1 : unemploymentRate < 7 ? 0 : -1;
  
  return impact;
};

export const findLatestValue = (data: any[], indicator: string): number => {
  const values = data
    .filter(d => d.indicator === indicator)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return values.length > 0 ? Number(values[0].value) : 0;
};

export const calculateAveragePerformance = (sectors: any[]): number => {
  if (!sectors.length) return 0;
  return sectors.reduce((sum: number, sector: any) => 
    sum + parseFloat(sector.changesPercentage), 0) / sectors.length;
};

