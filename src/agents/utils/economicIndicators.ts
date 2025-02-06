
export const processEconomicIndicators = (data: any[], findLatestValue: Function, calculateTrend: Function): any => {
  if (!Array.isArray(data)) return {};

  return {
    gdp: {
      value: findLatestValue(data, 'GDP'),
      trend: calculateTrend(data, 'GDP'),
      growth: calculateGrowthRate(data, 'GDP')
    },
    inflation: {
      value: findLatestValue(data, 'CPI'),
      trend: calculateTrend(data, 'CPI'),
      monthlyChange: calculateMonthlyChange(data, 'CPI')
    },
    unemployment: {
      value: findLatestValue(data, 'UNEMPLOYMENT'),
      trend: calculateTrend(data, 'UNEMPLOYMENT'),
      monthlyChange: calculateMonthlyChange(data, 'UNEMPLOYMENT')
    },
    interestRate: {
      value: findLatestValue(data, 'INTEREST_RATE'),
      trend: calculateTrend(data, 'INTEREST_RATE'),
      monthlyChange: calculateMonthlyChange(data, 'INTEREST_RATE')
    }
  };
};

export const analyzeTrends = (data: any[], calculateTrend: Function): string[] => {
  if (!Array.isArray(data)) return [];

  const trends = [];
  const gdpTrend = calculateTrend(data, 'GDP');
  const inflationTrend = calculateTrend(data, 'CPI');
  const unemploymentTrend = calculateTrend(data, 'UNEMPLOYMENT');
  
  if (gdpTrend > 0) trends.push('Economic Expansion');
  if (gdpTrend < 0) trends.push('Economic Contraction');
  if (inflationTrend > 0) trends.push('Rising Inflation');
  if (inflationTrend < 0) trends.push('Declining Inflation');
  if (unemploymentTrend < 0) trends.push('Improving Labor Market');
  if (unemploymentTrend > 0) trends.push('Weakening Labor Market');

  return trends;
};

export const calculateGrowthRate = (data: any[], indicator: string): number => {
  const values = data
    .filter(item => item.indicator === indicator)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (values.length < 2) return 0;

  const latest = Number(values[0].value);
  const previous = Number(values[1].value);
  return ((latest - previous) / previous) * 100;
};

export const calculateMonthlyChange = (data: any[], indicator: string): number => {
  const values = data
    .filter(item => item.indicator === indicator)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (values.length < 2) return 0;

  return Number(values[0].value) - Number(values[1].value);
};

