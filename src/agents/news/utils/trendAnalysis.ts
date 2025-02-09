
export const extractKeywords = (newsData: any[]): string[] => {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
  const keywords = new Map();

  newsData.forEach(news => {
    const words = (news.title + ' ' + news.text).toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    words.forEach(word => {
      keywords.set(word, (keywords.get(word) || 0) + 1);
    });
  });

  return Array.from(keywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
};

export const identifyTrends = (keywords: string[], newsData: any[]): any[] => {
  return keywords.map(keyword => ({
    keyword,
    frequency: newsData.filter(news => 
      (news.title + ' ' + news.text).toLowerCase().includes(keyword)
    ).length,
    sentiment: calculateKeywordSentiment(keyword, newsData)
  }));
};

const calculateKeywordSentiment = (keyword: string, newsData: any[]): string => {
  const relevantNews = newsData.filter(news => 
    (news.title + ' ' + news.text).toLowerCase().includes(keyword)
  );

  const avgSentiment = relevantNews.reduce((acc, news) => acc + news.sentiment.score, 0) / relevantNews.length;

  if (avgSentiment > 0.2) return 'positive';
  if (avgSentiment < -0.2) return 'negative';
  return 'neutral';
};
