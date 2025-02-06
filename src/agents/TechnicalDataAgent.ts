
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class TechnicalDataAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch technical indicators
      const technicalResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/technical_indicator/daily/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'technical-data',
        analysis: {
          technicalIndicators: this.processTechnicalIndicators(technicalResponse),
          volumeAnalysis: this.analyzeVolume(technicalResponse),
          trends: this.analyzeTrends(technicalResponse)
        }
      };
    } catch (error) {
      console.error('Error in technical data collection:', error);
      return {
        type: 'technical-data',
        analysis: {
          technicalIndicators: [],
          volumeAnalysis: 'Data unavailable',
          trends: []
        }
      };
    }
  }

  private static processTechnicalIndicators(data: any[]): any[] {
    if (!Array.isArray(data)) return [];
    return data.map(indicator => ({
      date: this.formatDate(indicator.date),
      rsi: indicator.rsi,
      macd: indicator.macd,
      bollinger: {
        upper: indicator.bbandsUpper,
        lower: indicator.bbandsLower
      }
    }));
  }

  private static analyzeVolume(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) return 'Volume data unavailable';
    const recentVolumes = data.slice(0, 5).map(d => d.volume);
    const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length;
    return `Average 5-day volume: ${this.formatNumber(avgVolume)}`;
  }

  private static analyzeTrends(data: any[]): string[] {
    if (!Array.isArray(data) || data.length === 0) return [];
    const trends = [];
    const lastData = data[0];
    
    if (lastData.rsi > 70) trends.push('Overbought conditions (RSI)');
    if (lastData.rsi < 30) trends.push('Oversold conditions (RSI)');
    if (lastData.macd > 0) trends.push('Positive MACD momentum');
    
    return trends;
  }
}

