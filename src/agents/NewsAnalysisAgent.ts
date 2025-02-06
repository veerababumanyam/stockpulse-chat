
export class NewsAnalysisAgent {
  static async analyze(symbol: string) {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);
      
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=5&apikey=${fmp}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Error || 'Failed to fetch news data');
      }

      const newsData = await response.json();
      
      if (!Array.isArray(newsData) || newsData.length === 0) {
        return {
          type: 'news',
          analysis: {
            recentNews: [],
            overallSentiment: 'No recent news available'
          }
        };
      }

      const filteredNews = newsData
        .filter((news: any) => news.title && news.text) // Only include news with title and text
        .map((news: any) => ({
          title: news.title,
          date: new Date(news.publishedDate).toLocaleDateString(),
          summary: news.text.substring(0, 150) + '...', // Add a brief summary
          sentiment: this.analyzeSentiment(news.text)
        }))
        .filter((news: any) => news.title && news.date); // Additional filter for mapped data
      
      return {
        type: 'news',
        analysis: {
          recentNews: filteredNews,
          overallSentiment: filteredNews.length > 0 
            ? this.getOverallSentiment(newsData)
            : 'No recent news available'
        }
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        type: 'news',
        analysis: {
          recentNews: [],
          overallSentiment: 'Unable to analyze news at this time'
        }
      };
    }
  }

  private static analyzeSentiment(text: string): string {
    const positiveWords = ['surge', 'gain', 'rise', 'positive', 'growth', 'profit'];
    const negativeWords = ['drop', 'fall', 'decline', 'negative', 'loss', 'concern'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      positiveCount += (text.toLowerCase().match(new RegExp(word, 'g')) || []).length;
    });
    
    negativeWords.forEach(word => {
      negativeCount += (text.toLowerCase().match(new RegExp(word, 'g')) || []).length;
    });
    
    if (positiveCount > negativeCount) return 'Positive';
    if (negativeCount > positiveCount) return 'Negative';
    return 'Neutral';
  }

  private static getOverallSentiment(newsData: any[]): string {
    const sentiments = newsData.map(news => this.analyzeSentiment(news.text));
    const positiveCount = sentiments.filter(s => s === 'Positive').length;
    const negativeCount = sentiments.filter(s => s === 'Negative').length;
    
    if (positiveCount > negativeCount) return 'Overall Positive News Sentiment';
    if (negativeCount > positiveCount) return 'Overall Negative News Sentiment';
    return 'Neutral News Sentiment';
  }
}
