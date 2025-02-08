
export const getSentimentColor = (sentiment: number) => {
  if (sentiment > 0.3) return "bg-green-500/10 text-green-500";
  if (sentiment < -0.3) return "bg-red-500/10 text-red-500";
  return "bg-yellow-500/10 text-yellow-500";
};

export const getSentimentLabel = (sentiment: number) => {
  if (sentiment > 0.3) return "Positive";
  if (sentiment < -0.3) return "Negative";
  return "Neutral";
};

export const commonWords = [
  'about', 'after', 'again', 'their', 'there', 'these', 'would', 'could'
];

export const analyzeTopics = (newsData: NewsItem[]) => {
  const topics = new Map<string, { count: number; totalSentiment: number }>();
  
  newsData.forEach(item => {
    const words = (item.title + ' ' + item.text).toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 4 && !commonWords.includes(word));
    
    const uniqueWords = Array.from(new Set(words));
    uniqueWords.forEach(word => {
      const current = topics.get(word) || { count: 0, totalSentiment: 0 };
      topics.set(word, {
        count: current.count + 1,
        totalSentiment: current.totalSentiment + item.sentiment.score
      });
    });
  });

  return Array.from(topics.entries())
    .map(([topic, { count, totalSentiment }]) => ({
      topic,
      count,
      sentiment: totalSentiment / count
    }))
    .filter(topic => topic.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};
