
export const determineSignal = (sentiment: any, significantNews: any[]): string => {
  if (sentiment.score > 0.5 && sentiment.confidence > 70) return 'strong buy';
  if (sentiment.score > 0.2) return 'buy';
  if (sentiment.score < -0.5 && sentiment.confidence > 70) return 'strong sell';
  if (sentiment.score < -0.2) return 'sell';
  return 'hold';
};

export const calculateImpactConfidence = (sentiment: any, significantNews: any[]): number => {
  let confidence = sentiment.confidence;
  confidence += Math.min(significantNews.length * 5, 20);
  return Math.min(confidence, 100);
};

export const extractMainTopic = (title: string): string => {
  const topics = ['earnings', 'merger', 'acquisition', 'product', 'management', 'regulatory'];
  return topics.find(topic => title.toLowerCase().includes(topic)) || '';
};

export const identifyKeyFactors = (significantNews: any[]): string[] => {
  return significantNews
    .map(news => extractMainTopic(news.title))
    .filter((topic, index, self) => topic && self.indexOf(topic) === index)
    .slice(0, 5);
};
