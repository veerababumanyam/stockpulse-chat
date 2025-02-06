
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class AlternativeDataAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // For now using social sentiment as alternative data source
      const response = await fetch(
        `https://financialmodelingprep.com/api/v4/social-sentiment?symbol=${symbol}&apikey=${fmp}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch alternative data');
      }

      const data = await response.json();
      console.log('Alternative data:', data);

      return {
        type: 'alternative-data',
        analysis: {
          signals: {
            overallSignal: this.determineSignal(data),
          },
          metrics: {
            socialSentiment: this.analyzeSocialSentiment(data),
            webTraffic: this.analyzeWebTraffic(data),
          },
          trends: this.analyzeTrends(data)
        }
      };
    } catch (error) {
      console.error('Error in alternative data analysis:', error);
      return {
        type: 'alternative-data',
        analysis: {
          signals: {
            overallSignal: 'NEUTRAL'
          },
          metrics: {},
          trends: []
        }
      };
    }
  }

  private static determineSignal(data: any): string {
    // Simplified signal determination based on sentiment
    const totalSentiment = data.reduce((acc: number, item: any) => 
      acc + (item.positiveScore || 0) - (item.negativeScore || 0), 0);
    
    if (totalSentiment > 10) return 'STRONG BUY';
    if (totalSentiment > 5) return 'BUY';
    if (totalSentiment < -10) return 'STRONG SELL';
    if (totalSentiment < -5) return 'SELL';
    return 'HOLD';
  }

  private static analyzeSocialSentiment(data: any): any {
    return {
      positive: data.reduce((acc: number, item: any) => acc + (item.positiveScore || 0), 0),
      negative: data.reduce((acc: number, item: any) => acc + (item.negativeScore || 0), 0),
      neutral: data.reduce((acc: number, item: any) => acc + (item.neutralScore || 0), 0)
    };
  }

  private static analyzeWebTraffic(data: any): any {
    return {
      visitCount: 'Data not available',
      engagement: 'Data not available'
    };
  }

  private static analyzeTrends(data: any): string[] {
    const trends = [];
    const sentiment = this.analyzeSocialSentiment(data);
    
    if (sentiment.positive > sentiment.negative * 2) {
      trends.push('Strong positive social sentiment');
    }
    if (sentiment.negative > sentiment.positive * 2) {
      trends.push('Strong negative social sentiment');
    }
    
    return trends;
  }
}
