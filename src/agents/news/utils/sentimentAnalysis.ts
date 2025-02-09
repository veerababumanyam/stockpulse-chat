
export const calculateSentiment = (text: string) => {
  const positiveWords = ['surge', 'gain', 'rise', 'growth', 'profit', 'success', 'boost', 'bullish', 'upgrade', 'outperform'];
  const negativeWords = ['drop', 'fall', 'decline', 'loss', 'risk', 'concern', 'fail', 'bearish', 'downgrade', 'underperform'];
  
  let score = 0;
  text = text.toLowerCase();
  
  positiveWords.forEach(word => {
    score += (text.match(new RegExp(word, 'g')) || []).length;
  });
  
  negativeWords.forEach(word => {
    score -= (text.match(new RegExp(word, 'g')) || []).length;
  });
  
  return {
    score: score / (text.length / 100),
    magnitude: Math.abs(score) / (text.length / 100)
  };
};

export const calculateSentimentScore = (sentiments: any[]): number => {
  if (sentiments.length === 0) return 0;
  return sentiments.reduce((acc, curr) => acc + curr.score, 0) / sentiments.length;
};

export const calculateSentimentTrend = (recent: any[], older: any[]): string => {
  if (recent.length === 0 || older.length === 0) return 'neutral';
  
  const recentAvg = calculateSentimentScore(recent);
  const olderAvg = calculateSentimentScore(older);

  if (recentAvg > olderAvg + 0.2) return 'improving';
  if (recentAvg < olderAvg - 0.2) return 'deteriorating';
  return 'stable';
};

export const calculateSentimentDistribution = (sentiments: any[]) => {
  const total = sentiments.length;
  const positive = sentiments.filter(s => s.score > 0).length;
  const negative = sentiments.filter(s => s.score < 0).length;
  const neutral = total - positive - negative;

  return {
    positive: (positive / total * 100).toFixed(1) + '%',
    negative: (negative / total * 100).toFixed(1) + '%',
    neutral: (neutral / total * 100).toFixed(1) + '%'
  };
};
