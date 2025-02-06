
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class SocialMediaScraperAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Use stock news as a proxy for social media sentiment
      const socialData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=100&apikey=${fmp}`,
        fmp
      );

      // Use Deepseek for enhanced sentiment analysis
      const sentimentAnalysis = await this.analyzeSocialSentiment(socialData);

      return {
        type: 'social-media-scraper',
        analysis: {
          sentiment: sentimentAnalysis,
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

  private static async analyzeSocialSentiment(data: any[]): Promise<any> {
    if (!Array.isArray(data) || data.length === 0) {
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

    const newsTexts = data.map(item => `${item.title} ${item.text}`).join('\n');
    const prompt = `Analyze the sentiment of the following news articles:\n${newsTexts}\n\nProvide a structured analysis with overall sentiment (Positive/Negative/Neutral), sentiment score (-1 to 1), and distribution percentages.`;

    try {
      const analysis = await this.analyzeWithDeepseek(prompt);
      const parsedAnalysis = JSON.parse(analysis);
      return {
        overallSentiment: parsedAnalysis.overallSentiment || 'Neutral',
        sentimentScore: parsedAnalysis.sentimentScore || 0,
        distribution: parsedAnalysis.distribution || {
          positive: '0%',
          negative: '0%',
          neutral: '100%'
        }
      };
    } catch (error) {
      console.error('Error in Deepseek sentiment analysis:', error);
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

  private static calculateTimeDistribution(data: any[]): { daysSpan: number; newest?: string; oldest?: string } {
    if (!Array.isArray(data) || data.length === 0) return { daysSpan: 0 };

    const validDates: number[] = data
      .map(item => new Date(item.publishedDate).getTime())
      .filter((timestamp): timestamp is number => !isNaN(timestamp));

    if (validDates.length === 0) return { daysSpan: 0 };

    const newest = Math.max(...validDates);
    const oldest = Math.min(...validDates);
    
    const daysSpan = Math.ceil((newest - oldest) / (1000 * 60 * 60 * 24));

    return {
      daysSpan,
      newest: this.formatDate(new Date(newest)),
      oldest: this.formatDate(new Date(oldest))
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
}
