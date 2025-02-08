
export const calculatePercentageChange = (current: number, previous: number): number => {
  return previous !== 0 ? ((current - previous) / previous) * 100 : 0;
};

export const calculateMovingAverage = (data: number[], period: number): number => {
  if (data.length < period) return 0;
  const sum = data.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

export const calculateStandardDeviation = (data: number[]): number {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squareDiffs = data.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  return Math.sqrt(avgSquareDiff);
};

export const calculateCorrelation = (data1: number[], data2: number[]): number => {
  if (data1.length !== data2.length || data1.length === 0) return 0;

  const mean1 = data1.reduce((a, b) => a + b, 0) / data1.length;
  const mean2 = data2.reduce((a, b) => a + b, 0) / data2.length;

  const diffProd = data1.map((val, i) => (val - mean1) * (data2[i] - mean2));
  const squareDiff1 = data1.map(val => Math.pow(val - mean1, 2));
  const squareDiff2 = data2.map(val => Math.pow(val - mean2, 2));

  const sum = diffProd.reduce((a, b) => a + b, 0);
  const standardDeviations = Math.sqrt(
    squareDiff1.reduce((a, b) => a + b, 0) * 
    squareDiff2.reduce((a, b) => a + b, 0)
  );

  return standardDeviations === 0 ? 0 : sum / standardDeviations;
};

