
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class NewsAnalysisAgent extends BaseAgent {
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

      const processedNews = this.processNewsData(newsResponse);
      const sentimentAnalysis = this.analyzeSentiment(processedNews);
      const trendsAnalysis = this.analyzeTrends(processedNews);
      const marketImpact = this.assessMarketImpact(processedNews, sentimentAnalysis);

      return {
        type: 'news-analysis',
        analysis: {
          sentimentAnalysis,
          trendsAnalysis,
          marketImpact,
          keyHighlights: this.extractKeyHighlights(processedNews)
        }
      };
    } catch (error) {
      console.error('Error in news analysis:', error);
      return {
        type: 'news-analysis',
        analysis: {
          sentimentAnalysis: { score: 0, trend: 'neutral' },
          trendsAnalysis: [],
          marketImpact: { signal: 'neutral', confidence: 0 },
          keyHighlights: []
        }
      };
    }
  }

  private static processNewsData(newsData: any[]): any[] {
    if (!Array.isArray(newsData)) return [];

    return newsData.map(news => ({
      title: news.title,
      text: news.text,
      date: new Date(news.publishedDate),
      source: news.site,
      sentiment: this.calculateSentiment(news.title + ' ' + news.text)
    }));
  }

  private static analyzeSentiment(newsData: any[]): any {
    if (newsData.length === 0) return { score: 0, trend: 'neutral' };

    const sentiments = newsData.map(news => news.sentiment);
    const recentSentiments = sentiments.slice(0, 10);
    const olderSentiments = sentiments.slice(10);

    return {
      score: this.calculateSentimentScore(sentiments),
      trend: this.calculateSentimentTrend(recentSentiments, olderSentiments),
      confidence: this.calculateConfidenceScore(newsData.length),
      distribution: this.calculateSentimentDistribution(sentiments)
    };
  }

  private static analyzeTrends(newsData: any[]): any[] {
    if (newsData.length === 0) return [];

    const keywords = this.extractKeywords(newsData);
    return this.identifyTrends(keywords, newsData);
  }

  private static assessMarketImpact(newsData: any[], sentiment: any): any {
    const recentNews = newsData.slice(0, 10);
    const significantNews = recentNews.filter(news => 
      Math.abs(news.sentiment.score) > 0.5
    );

    return {
      signal: this.determineSignal(sentiment, significantNews),
      confidence: this.calculateImpactConfidence(sentiment, significantNews),
      keyFactors: this.identifyKeyFactors(significantNews)
    };
  }

  private static calculateSentiment(text: string): any {
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
    
    return {
      score: score / (text.length / 100),
      magnitude: Math.abs(score) / (text.length / 100)
    };
  }

  private static calculateSentimentScore(sentiments: any[]): number {
    if (sentiments.length === 0) return 0;
    return sentiments.reduce((acc, curr) => acc + curr.score, 0) / sentiments.length;
  }

  private static calculateSentimentTrend(recent: any[], older: any[]): string {
    if (recent.length === 0 || older.length === 0) return 'neutral';

    const recentAvg = this.calculateSentimentScore(recent);
    const olderAvg = this.calculateSentimentScore(older);

    if (recentAvg > olderAvg + 0.2) return 'improving';
    if (recentAvg < olderAvg - 0.2) return 'deteriorating';
    return 'stable';
  }

  private static calculateConfidenceScore(sampleSize: number): number {
    // Base confidence of 50
    let confidence = 50;
    
    // Add up to 30 points based on sample size
    confidence += Math.min(sampleSize * 2, 30);
    
    // Ensure confidence doesn't exceed 100
    return Math.min(confidence, 100);
  }

  private static calculateSentimentDistribution(sentiments: any[]): any {
    const total = sentiments.length;
    const positive = sentiments.filter(s => s.score > 0).length;
    const negative = sentiments.filter(s => s.score < 0).length;
    const neutral = total - positive - negative;

    return {
      positive: (positive / total * 100).toFixed(1) + '%',
      negative: (negative / total * 100).toFixed(1) + '%',
      neutral: (neutral / total * 100).toFixed(1) + '%'
    };
  }

  private static extractKeywords(newsData: any[]): string[] {
    // Simplified keyword extraction
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
  }

  private static identifyTrends(keywords: string[], newsData: any[]): any[] {
    return keywords.map(keyword => ({
      keyword,
      frequency: newsData.filter(news => 
        (news.title + ' ' + news.text).toLowerCase().includes(keyword)
      ).length,
      sentiment: this.calculateKeywordSentiment(keyword, newsData)
    }));
  }

  private static calculateKeywordSentiment(keyword: string, newsData: any[]): string {
    const relevantNews = newsData.filter(news => 
      (news.title + ' ' + news.text).toLowerCase().includes(keyword)
    );

    const avgSentiment = relevantNews.reduce((acc, news) => acc + news.sentiment.score, 0) / relevantNews.length;

    if (avgSentiment > 0.2) return 'positive';
    if (avgSentiment < -0.2) return 'negative';
    return 'neutral';
  }

  private static determineSignal(sentiment: any, significantNews: any[]): string {
    if (sentiment.score > 0.5 && sentiment.confidence > 70) return 'strong buy';
    if (sentiment.score > 0.2) return 'buy';
    if (sentiment.score < -0.5 && sentiment.confidence > 70) return 'strong sell';
    if (sentiment.score < -0.2) return 'sell';
    return 'hold';
  }

  private static calculateImpactConfidence(sentiment: any, significantNews: any[]): number {
    let confidence = sentiment.confidence;
    
    // Adjust confidence based on significant news quantity
    confidence += Math.min(significantNews.length * 5, 20);
    
    return Math.min(confidence, 100);
  }

  private static identifyKeyFactors(significantNews: any[]): string[] {
    return significantNews
      .map(news => this.extractMainTopic(news.title))
      .filter((topic, index, self) => topic && self.indexOf(topic) === index)
      .slice(0, 5);
  }

  private static extractMainTopic(title: string): string {
    // Simplified topic extraction
    const topics = ['earnings', 'merger', 'acquisition', 'product', 'management', 'regulatory'];
    return topics.find(topic => title.toLowerCase().includes(topic)) || '';
  }

  private static extractKeyHighlights(newsData: any[]): any[] {
    return newsData
      .filter(news => Math.abs(news.sentiment.score) > 0.3)
      .slice(0, 5)
      .map(news => ({
        title: news.title,
        date: this.formatDate(news.date),
        sentiment: news.sentiment.score > 0 ? 'positive' : 'negative',
        significance: Math.abs(news.sentiment.score)
      }));
  }
}
