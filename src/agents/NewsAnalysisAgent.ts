
export class NewsAnalysisAgent {
  static async analyze(symbol: string) {
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=5&apikey=${localStorage.getItem('fmp_api_key')}`
      );
      const newsData = await response.json();
      
      return {
        type: 'news',
        analysis: {
          recentNews: newsData.map((news: any) => ({
            title: news.title,
            date: new Date(news.publishedDate).toLocaleDateString(),
            summary: news.text,
            sentiment: this.analyzeSentiment(news.text)
          })),
          overallSentiment: this.getOverallSentiment(newsData)
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
