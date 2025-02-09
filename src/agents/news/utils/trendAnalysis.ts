
export const extractKeywords = (newsData: any[]): string[] => {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
  const keywords = new Map();

  newsData.forEach(news => {
    if (news.symbol) {
      keywords.set(news.symbol, (keywords.get(news.symbol) || 0) + 1);
    }

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
  const stockTrends = keywords
    .filter(keyword => /^[A-Z]{1,5}$/.test(keyword))
    .map(symbol => ({
      symbol,
      frequency: newsData.filter(news => news.symbol === symbol).length,
      sentiment: calculateKeywordSentiment(symbol, newsData)
    }));

  return stockTrends.length > 0 ? stockTrends : keywords.map(keyword => ({
    topic: keyword,
    frequency: newsData.filter(news => 
      (news.title + ' ' + news.text).toLowerCase().includes(keyword)
    ).length,
    sentiment: calculateKeywordSentiment(keyword, newsData)
  }));
};

const calculateKeywordSentiment = (keyword: string, newsData: any[]): string => {
  const relevantNews = newsData.filter(news => 
    news.symbol === keyword || 
    (news.title + ' ' + news.text).toLowerCase().includes(keyword.toLowerCase())
  );

  if (relevantNews.length === 0) return 'neutral';

  const avgSentiment = relevantNews.reduce((acc, news) => acc + news.sentiment.score, 0) / relevantNews.length;

  if (avgSentiment > 0.2) return 'positive';
  if (avgSentiment < -0.2) return 'negative';
  return 'neutral';
};
