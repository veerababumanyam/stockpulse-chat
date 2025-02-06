
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class MarketSentimentAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [newsResponse, socialResponse] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=10&apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v4/social-sentiment?symbol=${symbol}&apikey=${fmp}`,
          fmp
        )
      ]);

      return {
        type: 'sentiment',
        analysis: {
          newsSentiment: this.analyzeNewsSentiment(newsResponse),
          overallSentiment: this.calculateOverallSentiment(newsResponse, socialResponse),
          sentimentTrend: this.analyzeSentimentTrend(newsResponse)
        }
      };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      return {
        type: 'sentiment',
        analysis: {
          newsSentiment: 'Unable to analyze news sentiment',
          overallSentiment: 'Sentiment data unavailable',
          sentimentTrend: 'Trend analysis unavailable'
        }
      };
    }
  }

  private static analyzeNewsSentiment(newsData: any[]): string {
    if (!Array.isArray(newsData) || newsData.length === 0) {
      return 'No recent news available';
    }

    const sentiments = newsData.map(news => this.getSentimentScore(news.text));
    const averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

    if (averageSentiment > 0.5) return 'Strongly Positive';
    if (averageSentiment > 0) return 'Moderately Positive';
    if (averageSentiment < -0.5) return 'Strongly Negative';
    if (averageSentiment < 0) return 'Moderately Negative';
    return 'Neutral';
  }

  private static getSentimentScore(text: string): number {
    const positiveWords = ['surge', 'gain', 'rise', 'positive', 'growth', 'profit'];
    const negativeWords = ['drop', 'fall', 'decline', 'negative', 'loss', 'concern'];
    
    let score = 0;
    text = text.toLowerCase();
    
    positiveWords.forEach(word => {
      score += (text.match(new RegExp(word, 'g')) || []).length;
    });
    
    negativeWords.forEach(word => {
      score -= (text.match(new RegExp(word, 'g')) || []).length;
    });
    
    return score / (text.length / 100); // Normalize by text length
  }

  private static calculateOverallSentiment(newsData: any[], socialData: any): string {
    const newsSentiment = this.analyzeNewsSentiment(newsData);
    
    if (newsSentiment.includes('Strongly')) {
      return newsSentiment;
    }
    
    return 'Mixed Sentiment';
  }

  private static analyzeSentimentTrend(newsData: any[]): string {
    if (!Array.isArray(newsData) || newsData.length === 0) {
      return 'No trend data available';
    }

    const recentSentiments = newsData
      .slice(0, 5)
      .map(news => this.getSentimentScore(news.text));
    
    const oldSentiments = newsData
      .slice(-5)
      .map(news => this.getSentimentScore(news.text));

    const recentAvg = recentSentiments.reduce((a, b) => a + b, 0) / recentSentiments.length;
    const oldAvg = oldSentiments.reduce((a, b) => a + b, 0) / oldSentiments.length;

    if (recentAvg > oldAvg + 0.5) return 'Improving Sentiment';
    if (recentAvg < oldAvg - 0.5) return 'Deteriorating Sentiment';
    return 'Stable Sentiment';
  }
}
