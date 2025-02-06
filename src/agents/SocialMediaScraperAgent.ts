
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class SocialMediaScraperAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Use stock news as a proxy for social media sentiment since we don't have direct social API access
      const socialData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=100&apikey=${fmp}`,
        fmp
      );

      return {
        type: 'social-media-scraper',
        analysis: {
          sentiment: this.analyzeSocialSentiment(socialData),
          trendingTopics: this.extractTrendingTopics(socialData),
          socialMetrics: this.calculateSocialMetrics(socialData),
          influencerMentions: this.analyzeInfluencerMentions(socialData)
        }
      };
    } catch (error) {
      console.error('Error in social media scraping:', error);
      return {
        type: 'social-media-scraper',
        analysis: {
          sentiment: {},
          trendingTopics: [],
          socialMetrics: {},
          influencerMentions: []
        }
      };
    }
  }

  private static analyzeSocialSentiment(data: any[]): any {
    if (!Array.isArray(data)) return {};

    const sentimentWords = {
      positive: ['bullish', 'growth', 'up', 'gain', 'positive', 'success'],
      negative: ['bearish', 'down', 'loss', 'negative', 'fail', 'risk']
    };

    let sentimentScore = 0;
    let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

    data.forEach(item => {
      const text = (item.title + ' ' + item.text).toLowerCase();
      let itemSentiment = 0;

      sentimentWords.positive.forEach(word => {
        const count = (text.match(new RegExp(word, 'g')) || []).length;
        sentimentScore += count;
        itemSentiment += count;
      });

      sentimentWords.negative.forEach(word => {
        const count = (text.match(new RegExp(word, 'g')) || []).length;
        sentimentScore -= count;
        itemSentiment -= count;
      });

      if (itemSentiment > 0) sentimentCounts.positive++;
      else if (itemSentiment < 0) sentimentCounts.negative++;
      else sentimentCounts.neutral++;
    });

    const total = data.length || 1;
    return {
      overallSentiment: sentimentScore > 0 ? 'Positive' : sentimentScore < 0 ? 'Negative' : 'Neutral',
      sentimentScore: sentimentScore,
      distribution: {
        positive: ((sentimentCounts.positive / total) * 100).toFixed(2) + '%',
        negative: ((sentimentCounts.negative / total) * 100).toFixed(2) + '%',
        neutral: ((sentimentCounts.neutral / total) * 100).toFixed(2) + '%'
      }
    };
  }

  private static extractTrendingTopics(data: any[]): string[] {
    if (!Array.isArray(data)) return [];

    const words = data
      .map(item => (item.title + ' ' + item.text).toLowerCase())
      .join(' ')
      .split(/\W+/)
      .filter(word => word.length > 4);

    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    return Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private static calculateSocialMetrics(data: any[]): any {
    if (!Array.isArray(data)) return {};

    const sources = new Set(data.map(item => item.site));
    const timeDistribution = this.calculateTimeDistribution(data);

    return {
      totalMentions: data.length,
      uniqueSources: sources.size,
      mentionsPerDay: (data.length / Math.max(1, timeDistribution.daysSpan)).toFixed(2),
      sourceDistribution: Array.from(sources).map(source => ({
        source,
        count: data.filter(item => item.site === source).length
      }))
    };
  }

  private static analyzeInfluencerMentions(data: any[]): any[] {
    if (!Array.isArray(data)) return [];

    const sources = data.reduce((acc: Record<string, number>, item) => {
      acc[item.site] = (acc[item.site] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, mentions]) => ({
        source,
        mentions,
        recentMention: this.formatDate(
          data.find(item => item.site === source)?.publishedDate || new Date()
        )
      }));
  }

  private static calculateTimeDistribution(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) return { daysSpan: 0 };

    const dates = data.map(item => new Date(item.publishedDate).getTime());
    const newest = Math.max(...dates);
    const oldest = Math.min(...dates);
    const daysSpan = Math.ceil((newest - oldest) / (1000 * 60 * 60 * 24));

    return {
      daysSpan,
      newest: this.formatDate(new Date(newest)),
      oldest: this.formatDate(new Date(oldest))
    };
  }
}
