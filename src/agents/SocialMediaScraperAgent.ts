
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class SocialMediaScraperAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Get social sentiment data from FMP API
      const sentimentData = await this.fetchData(
        `https://financialmodelingprep.com/api/v4/social-sentiment?symbol=${symbol}&limit=100&apikey=${fmp}`,
        fmp
      );

      return {
        type: 'social-media-scraper',
        analysis: {
          sentiment: this.analyzeSocialSentiment(sentimentData),
          trendingTopics: this.extractTrendingTopics(sentimentData),
          socialMetrics: this.calculateSocialMetrics(sentimentData),
          influencerMentions: this.analyzeInfluencerMentions(sentimentData)
        }
      };
    } catch (error) {
      console.error('Error in social media analysis:', error);
      return {
        type: 'social-media-scraper',
        analysis: {
          sentiment: this.getDefaultSentiment(),
          trendingTopics: [],
          socialMetrics: this.getDefaultMetrics(),
          influencerMentions: []
        }
      };
    }
  }

  private static analyzeSocialSentiment(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      return this.getDefaultSentiment();
    }

    const sentiments = data.map(item => item.sentiment);
    const positiveCount = sentiments.filter(s => s > 0).length;
    const negativeCount = sentiments.filter(s => s < 0).length;
    const neutralCount = sentiments.length - positiveCount - negativeCount;

    return {
      overallSentiment: this.calculateOverallSentiment(positiveCount, negativeCount, data.length),
      sentimentScore: this.calculateSentimentScore(sentiments),
      distribution: {
        positive: `${((positiveCount / data.length) * 100).toFixed(1)}%`,
        negative: `${((negativeCount / data.length) * 100).toFixed(1)}%`,
        neutral: `${((neutralCount / data.length) * 100).toFixed(1)}%`
      }
    };
  }

  private static calculateSocialMetrics(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      return this.getDefaultMetrics();
    }

    const uniqueSources = new Set(data.map(item => item.source)).size;
    const { daysSpan } = this.calculateTimeDistribution(data);
    
    return {
      totalMentions: data.length,
      uniqueSources,
      mentionsPerDay: daysSpan ? (data.length / daysSpan).toFixed(1) : '0',
      sourceDistribution: this.calculateSourceDistribution(data)
    };
  }

  private static calculateTimeDistribution(data: any[]): { daysSpan: number; newest?: string; oldest?: string } {
    if (!Array.isArray(data) || data.length === 0) {
      return { daysSpan: 0 };
    }

    const dates = data.map(item => new Date(item.date));
    const timestamps = dates.map(date => date.getTime());
    const newest = new Date(Math.max(...timestamps));
    const oldest = new Date(Math.min(...timestamps));
    const daysSpan = Math.ceil((newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24));

    return {
      daysSpan,
      newest: newest.toISOString().split('T')[0],
      oldest: oldest.toISOString().split('T')[0]
    };
  }

  private static analyzeInfluencerMentions(data: any[]): any[] {
    if (!Array.isArray(data)) return [];

    return data
      .filter(item => item.influence_score > 70)
      .map(item => ({
        source: item.source,
        date: this.formatDate(item.date),
        sentiment: item.sentiment,
        influenceScore: item.influence_score
      }))
      .slice(0, 5);
  }

  private static extractTrendingTopics(data: any[]): string[] {
    if (!Array.isArray(data)) return [];

    const topics = new Map<string, number>();
    data.forEach(item => {
      const words = item.text?.toLowerCase().split(/\W+/) || [];
      words.forEach(word => {
        if (word.length > 4) {
          topics.set(word, (topics.get(word) || 0) + 1);
        }
      });
    });

    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic);
  }

  private static calculateSourceDistribution(data: any[]): any[] {
    if (!Array.isArray(data)) return [];

    const sources = new Map<string, number>();
    data.forEach(item => {
      sources.set(item.source, (sources.get(item.source) || 0) + 1);
    });

    return Array.from(sources.entries())
      .map(([source, count]) => ({
        source,
        percentage: ((count / data.length) * 100).toFixed(1) + '%'
      }))
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
      .slice(0, 5);
  }

  private static calculateOverallSentiment(positive: number, negative: number, total: number): string {
    const ratio = (positive - negative) / total;
    if (ratio > 0.3) return 'Very Positive';
    if (ratio > 0.1) return 'Positive';
    if (ratio < -0.3) return 'Very Negative';
    if (ratio < -0.1) return 'Negative';
    return 'Neutral';
  }

  private static calculateSentimentScore(sentiments: number[]): number {
    if (sentiments.length === 0) return 0;
    return sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length;
  }

  private static getDefaultSentiment(): any {
    return {
      overallSentiment: 'Neutral',
      sentimentScore: 0,
      distribution: {
        positive: '0%',
        negative: '0%',
        neutral: '100%'
      }
    };
  }

  private static getDefaultMetrics(): any {
    return {
      totalMentions: 0,
      uniqueSources: 0,
      mentionsPerDay: '0',
      sourceDistribution: []
    };
  }
}
