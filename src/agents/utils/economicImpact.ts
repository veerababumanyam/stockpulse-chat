
export const assessMarketImpact = (data: any[], profile: any, findLatestValue: Function): any => {
  const gdpGrowth = calculateGrowthRate(data, 'GDP');
  const inflation = findLatestValue(data, 'CPI');
  const interestRate = findLatestValue(data, 'INTEREST_RATE');

  return {
    growthOutlook: assessGrowthOutlook(gdpGrowth, inflation),
    monetaryEnvironment: assessMonetaryEnvironment(interestRate, inflation),
    marketConditions: assessMarketConditions(gdpGrowth, inflation, interestRate),
    sectorImpact: assessSectorImpact(profile?.sector, gdpGrowth, inflation, interestRate)
  };
};

export const assessGrowthOutlook = (gdpGrowth: number, inflation: number): string => {
  if (gdpGrowth > 3 && inflation < 3) return 'Strong Growth Potential';
  if (gdpGrowth > 0 && inflation < 5) return 'Moderate Growth';
  if (gdpGrowth < 0 || inflation > 5) return 'Challenging Growth Environment';
  return 'Stable Growth Environment';
};

export const assessMonetaryEnvironment = (interestRate: number, inflation: number): string => {
  const realRate = interestRate - inflation;
  if (realRate < -2) return 'Highly Accommodative';
  if (realRate < 0) return 'Accommodative';
  if (realRate > 2) return 'Restrictive';
  return 'Neutral';
};

export const assessMarketConditions = (gdp: number, inflation: number, rates: number): string => {
  const score = (gdp * 0.4) - (inflation * 0.3) - (rates * 0.3);
  if (score > 2) return 'Very Favorable';
  if (score > 0) return 'Favorable';
  if (score > -2) return 'Challenging';
  return 'Very Challenging';
};

export const assessSectorImpact = (sector: string, gdpGrowth: number, inflation: number, interestRate: number): string => {
  if (!sector) return 'Sector impact assessment unavailable';

  const sectorRatings: Record<string, (gdp: number, inf: number, rate: number) => string> = {
    'Technology': (gdp, inf, rate) => 
      gdp > 2 && rate < 4 ? 'Highly Positive' : 
      gdp > 0 ? 'Positive' : 'Negative',
    'Financial': (gdp, inf, rate) => 
      rate > 3 && gdp > 0 ? 'Highly Positive' : 
      rate > 2 ? 'Positive' : 'Negative',
    'Consumer': (gdp, inf, rate) => 
      gdp > 2 && inf < 3 ? 'Highly Positive' : 
      gdp > 0 && inf < 4 ? 'Positive' : 'Negative',
    'Industrial': (gdp, inf, rate) => 
      gdp > 2 ? 'Highly Positive' : 
      gdp > 0 ? 'Positive' : 'Negative'
  };

  const ratingFunction = sectorRatings[sector];
  return ratingFunction ? 
    ratingFunction(gdpGrowth, inflation, interestRate) : 
    'Sector-specific impact unknown';
};

const calculateGrowthRate = (data: any[], indicator: string): number => {
  const values = data
    .filter(item => item.indicator === indicator)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (values.length < 2) return 0;

  const latest = Number(values[0].value);
  const previous = Number(values[1].value);
  return ((latest - previous) / previous) * 100;
};

