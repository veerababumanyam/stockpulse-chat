
export const extractRecommendationFromText = (text: string): string | undefined => {
  const buyKeywords = ['buy', 'bullish', 'upgrade', 'outperform'];
  const sellKeywords = ['sell', 'bearish', 'downgrade', 'underperform'];
  const holdKeywords = ['hold', 'neutral', 'market perform'];

  text = text.toLowerCase();

  if (buyKeywords.some(keyword => text.includes(keyword))) return 'BUY';
  if (sellKeywords.some(keyword => text.includes(keyword))) return 'SELL';
  if (holdKeywords.some(keyword => text.includes(keyword))) return 'HOLD';
  return undefined;
};
