
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
      const impactAnalysis = this.analyzeNewsImpact(recentNews);

      return {
        type: 'news-scraper',
        analysis: {
          recentNews,
          sentimentAnalysis,
          impactAnalysis,
          newsStats: this.calculateNewsStats(recentNews)
        }
      };
    } catch (error) {
      console.error('Error in news scraping:', error);
      return {
        type: 'news-scraper',
        analysis: {
          recentNews: [],
          sentimentAnalysis: { overall: 'neutral', confidence: 0 },
          impactAnalysis: [],
          newsStats: { total: 0, categories: {} }
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
      summary: item.text?.substring(0, 200) + '...',
      sentiment: this.calculateNewsSentiment(item.title + ' ' + (item.text || ''))
    }));
  }

  private static analyzeSentiment(news: any[]): any {
    if (news.length === 0) return { overall: 'neutral', confidence: 0 };

    const sentiments = news.map(item => item.sentiment);
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const totalCount = sentiments.length;

    const overallSentiment = this.determineOverallSentiment(positiveCount, negativeCount, totalCount);
    const confidence = this.calculateSentimentConfidence(positiveCount, negativeCount, totalCount);

    return {
      overall: overallSentiment,
      confidence,
      breakdown: {
        positive: (positiveCount / totalCount * 100).toFixed(1) + '%',
        negative: (negativeCount / totalCount * 100).toFixed(1) + '%',
        neutral: ((totalCount - positiveCount - negativeCount) / totalCount * 100).toFixed(1) + '%'
      }
    };
  }

  private static calculateNewsSentiment(text: string): string {
    const positiveWords = ['surge', 'gain', 'rise', 'growth', 'profit', 'success', 'boost'];
    const negativeWords = ['drop', 'fall', 'decline', 'loss', 'risk', 'concern', 'fail'];

    let score = 0;
    text = text.toLowerCase();

    positiveWords.forEach(word => {
      score += (text.match(new RegExp(word, 'g')) || []).length;
    });

    negativeWords.forEach(word => {
      score -= (text.match(new RegExp(word, 'g')) || []).length;
    });

    if (score > 2) return 'positive';
    if (score < -2) return 'negative';
    return 'neutral';
  }

  private static analyzeNewsImpact(news: any[]): any[] {
    return news
      .filter(item => item.sentiment !== 'neutral')
      .map(item => ({
        headline: item.title,
        impact: item.sentiment === 'positive' ? 'Positive' : 'Negative',
        date: item.date,
        significance: this.calculateNewsSignificance(item)
      }))
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 5);
  }

  private static calculateNewsStats(news: any[]): any {
    const categories: Record<string, number> = {};
    news.forEach(item => {
      const source = item.source;
      categories[source] = (categories[source] || 0) + 1;
    });

    return {
      total: news.length,
      categories,
      sourceDiversity: Object.keys(categories).length
    };
  }

  private static determineOverallSentiment(positive: number, negative: number, total: number): string {
    const positiveRatio = positive / total;
    const negativeRatio = negative / total;

    if (positiveRatio > 0.6) return 'very positive';
    if (positiveRatio > 0.4) return 'positive';
    if (negativeRatio > 0.6) return 'very negative';
    if (negativeRatio > 0.4) return 'negative';
    return 'neutral';
  }

  private static calculateSentimentConfidence(positive: number, negative: number, total: number): number {
    // Base confidence calculation
    const dominantSentiment = Math.max(positive, negative);
    const sentimentStrength = (dominantSentiment / total) * 100;
    
    // Adjust confidence based on sample size
    const sampleSizeAdjustment = Math.min(total / 10, 20); // Max 20 points for sample size
    
    return Math.min(Math.round(sentimentStrength + sampleSizeAdjustment), 100);
  }

  private static calculateNewsSignificance(newsItem: any): number {
    let significance = 50; // Base significance

    // Adjust based on sentiment strength
    significance += newsItem.sentiment === 'very positive' || newsItem.sentiment === 'very negative' ? 20 : 0;

    // Adjust based on recency (newer news is more significant)
    const daysSincePublication = (new Date().getTime() - new Date(newsItem.date).getTime()) / (1000 * 60 * 60 * 24);
    significance -= Math.min(daysSincePublication * 2, 30); // Max 30 points reduction for old news

    return Math.max(0, Math.min(100, significance));
  }
}
