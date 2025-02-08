
export const formatLargeNumber = (num: number) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  return num.toFixed(2);
};

export const formatPercentage = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  return `${value.toFixed(2)}%`;
};

export const getPriceChangeColor = (change: number) => {
  if (change === null || change === undefined || isNaN(change)) {
    return 'text-muted-foreground';
  }
  return change > 0 ? 'text-green-500' : 'text-red-500';
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

export const formatPrice = (price: number | string | null | undefined) => {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(price));
};

export const formatVolume = (volume: number) => {
  if (isNaN(volume) || volume === null || volume === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(volume);
};
