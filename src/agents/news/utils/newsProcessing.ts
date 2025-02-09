
export const processNewsData = (newsData: any[]): any[] => {
  if (!Array.isArray(newsData)) return [];

  return newsData.map(news => ({
    title: news.title,
    text: news.text,
    date: new Date(news.publishedDate),
    source: news.site,
    sentiment: calculateSentiment(news.title + ' ' + news.text)
  }));
};

export const extractKeyHighlights = (newsData: any[]): any[] => {
  return newsData
    .filter(news => Math.abs(news.sentiment.score) > 0.3)
    .slice(0, 5)
    .map(news => ({
      title: news.title,
      date: formatDate(news.date),
      sentiment: news.sentiment.score > 0 ? 'positive' : 'negative',
      significance: Math.abs(news.sentiment.score)
    }));
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};
