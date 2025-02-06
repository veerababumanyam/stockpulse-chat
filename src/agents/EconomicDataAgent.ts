
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class EconomicDataAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const economicData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/economic?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'economic-data',
        analysis: {
          indicators: this.processEconomicIndicators(economicData),
          trends: this.analyzeTrends(economicData),
          impact: this.assessMarketImpact(economicData, symbol)
        }
      };
    } catch (error) {
      console.error('Error in economic data analysis:', error);
      return {
        type: 'economic-data',
        analysis: {
          indicators: {},
          trends: [],
          impact: {}
        }
      };
    }
  }

  private static processEconomicIndicators(data: any[]): any {
    if (!Array.isArray(data)) return {};

    const indicators = {
      gdp: this.findLatestValue(data, 'GDP'),
      inflation: this.findLatestValue(data, 'CPI'),
      unemployment: this.findLatestValue(data, 'UNEMPLOYMENT'),
      interestRate: this.findLatestValue(data, 'INTEREST_RATE')
    };

    return indicators;
  }

  private static analyzeTrends(data: any[]): string[] {
    if (!Array.isArray(data)) return [];

    const trends = [];
    const gdpTrend = this.calculateTrend(data, 'GDP');
    const inflationTrend = this.calculateTrend(data, 'CPI');
    
    if (gdpTrend > 0) trends.push('GDP Growth');
    if (gdpTrend < 0) trends.push('GDP Contraction');
    if (inflationTrend > 0) trends.push('Rising Inflation');
    if (inflationTrend < 0) trends.push('Decreasing Inflation');

    return trends;
  }

  private static assessMarketImpact(data: any[], symbol: string): any {
    return {
      gdpImpact: 'Moderate',
      inflationImpact: 'High',
      recommendedActions: [
        'Monitor interest rate changes',
        'Watch inflation trends',
        'Track GDP growth rate'
      ]
    };
  }

  private static findLatestValue(data: any[], indicator: string): number {
    const relevantData = data.find(item => item.indicator === indicator);
    return relevantData ? Number(relevantData.value) : 0;
  }

  private static calculateTrend(data: any[], indicator: string): number {
    const relevantData = data
      .filter(item => item.indicator === indicator)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (relevantData.length < 2) return 0;
    
    const latest = Number(relevantData[0].value);
    const previous = Number(relevantData[1].value);
    return latest - previous;
  }
}
