
export const formatLargeNumber = (num: number) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  return num.toFixed(2);
};

export const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

export const getPriceChangeColor = (change: number) => {
  return change >= 0 ? 'text-green-500' : 'text-red-500';
};

export const getRecommendationColor = (rating: string) => {
  switch (rating?.toLowerCase()) {
    case 'buy':
    case 'strong buy':
      return 'bg-green-500';
    case 'sell':
    case 'strong sell':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};
