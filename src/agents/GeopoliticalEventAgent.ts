
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class GeopoliticalEventAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Use news data to identify geopolitical events
      const newsData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=100&apikey=${fmp}`,
        fmp
      );

      return {
        type: 'geopolitical-event',
        analysis: {
          events: this.identifyGeopoliticalEvents(newsData),
          impact: this.assessImpact(newsData, symbol),
          regions: this.identifyAffectedRegions(newsData),
          recommendations: this.generateRecommendations(newsData)
        }
      };
    } catch (error) {
      console.error('Error in geopolitical event analysis:', error);
      return {
        type: 'geopolitical-event',
        analysis: {
          events: [],
          impact: {},
          regions: [],
          recommendations: []
        }
      };
    }
  }

  private static identifyGeopoliticalEvents(news: any[]): any[] {
    if (!Array.isArray(news)) return [];

    const geopoliticalKeywords = [
      'trade war', 'sanctions', 'tariffs', 'election',
      'conflict', 'regulation', 'policy', 'government'
    ];

    return news
      .filter(item => {
        const text = (item.title + ' ' + item.text).toLowerCase();
        return geopoliticalKeywords.some(keyword => text.includes(keyword));
      })
      .map(item => ({
        title: item.title,
        date: this.formatDate(item.publishedDate),
        source: item.site,
        type: this.categorizeEvent(item.title + ' ' + item.text)
      }))
      .slice(0, 5);
  }

  private static assessImpact(news: any[], symbol: string): any {
    const events = this.identifyGeopoliticalEvents(news);
    
    return {
      marketImpact: this.calculateMarketImpact(events),
      volatilityRisk: this.assessVolatilityRisk(events),
      sentimentScore: this.calculateSentimentScore(events)
    };
  }

  private static identifyAffectedRegions(news: any[]): string[] {
    const regions = new Set<string>();
    const regionKeywords: Record<string, string[]> = {
      'North America': ['US', 'Canada', 'Mexico'],
      'Europe': ['EU', 'European', 'Brexit'],
      'Asia': ['China', 'Japan', 'Korea'],
      'Middle East': ['Saudi', 'Iran', 'UAE']
    };

    news.forEach(item => {
      const text = (item.title + ' ' + item.text).toLowerCase();
      Object.entries(regionKeywords).forEach(([region, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          regions.add(region);
        }
      });
    });

    return Array.from(regions);
  }

  private static generateRecommendations(news: any[]): string[] {
    const events = this.identifyGeopoliticalEvents(news);
    const recommendations = new Set<string>();

    events.forEach(event => {
      if (event.type === 'Trade') {
        recommendations.add('Monitor international trade developments');
      }
      if (event.type === 'Policy') {
        recommendations.add('Review regulatory compliance');
      }
      if (event.type === 'Conflict') {
        recommendations.add('Assess supply chain vulnerabilities');
      }
    });

    return Array.from(recommendations);
  }

  private static categorizeEvent(text: string): string {
    text = text.toLowerCase();
    if (text.includes('trade') || text.includes('tariff')) return 'Trade';
    if (text.includes('policy') || text.includes('regulation')) return 'Policy';
    if (text.includes('conflict') || text.includes('war')) return 'Conflict';
    return 'Other';
  }

  private static calculateMarketImpact(events: any[]): string {
    const impactScore = events.length;
    if (impactScore > 3) return 'High';
    if (impactScore > 1) return 'Medium';
    return 'Low';
  }

  private static assessVolatilityRisk(events: any[]): string {
    const riskScore = events.filter(e => e.type === 'Conflict' || e.type === 'Policy').length;
    if (riskScore > 2) return 'High';
    if (riskScore > 0) return 'Medium';
    return 'Low';
  }

  private static calculateSentimentScore(events: any[]): number {
    return events.length > 0 ? (1 - (events.length / 10)) * 100 : 100;
  }
}
