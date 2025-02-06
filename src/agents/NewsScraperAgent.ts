
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class NewsScraperAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const newsResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=50&apikey=${fmp}`,
        fmp
      );

      const recentNews = this.processNewsData(newsResponse);
      const sentimentAnalysis = this.analyzeSentiment(recentNews);

      return {
        type: 'news-scraper',
        analysis: {
          recentNews,
          newsSentiment: sentimentAnalysis,
          newsCount: recentNews.length,
          sources: this.getNewsSources(recentNews)
        }
      };
    } catch (error) {
      console.error('Error in news scraping:', error);
      return {
        type: 'news-scraper',
        analysis: {
          recentNews: [],
          newsSentiment: 'neutral',
          newsCount: 0,
          sources: []
        }
      };
    }
  }

  private static processNewsData(news: any[]): any[] {
    if (!Array.isArray(news)) return [];
    return news.map(item => ({
      title: item.title,
      date: this.formatDate(item.publishedDate),
      source: item.site,
      url: item.url,
      summary: item.text?.substring(0, 200) + '...'
    }));
  }

  private static analyzeSentiment(news: any[]): string {
    if (news.length === 0) return 'neutral';
    
    const sentimentWords = {
      positive: ['surge', 'gain', 'rise', 'growth', 'profit', 'success', 'boost'],
      negative: ['drop', 'fall', 'decline', 'loss', 'risk', 'concern', 'fail']
    };

    let sentimentScore = 0;
    news.forEach(item => {
      const text = (item.title + ' ' + item.summary).toLowerCase();
      sentimentWords.positive.forEach(word => {
        sentimentScore += (text.match(new RegExp(word, 'g')) || []).length;
      });
      sentimentWords.negative.forEach(word => {
        sentimentScore -= (text.match(new RegExp(word, 'g')) || []).length;
      });
    });

    if (sentimentScore > 5) return 'very positive';
    if (sentimentScore > 0) return 'positive';
    if (sentimentScore < -5) return 'very negative';
    if (sentimentScore < 0) return 'negative';
    return 'neutral';
  }

  private static getNewsSources(news: any[]): string[] {
    return [...new Set(news.map(item => item.source))];
  }
}
