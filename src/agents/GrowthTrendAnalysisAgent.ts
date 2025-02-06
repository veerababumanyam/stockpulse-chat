
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class GrowthTrendAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const growthResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/income-statement-growth/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'growth-trends',
        analysis: {
          revenueGrowth: this.analyzeRevenueGrowth(growthResponse),
          profitabilityTrend: this.analyzeProfitabilityTrend(growthResponse),
          growthStability: this.assessGrowthStability(growthResponse)
        }
      };
    } catch (error) {
      console.error('Error in growth trend analysis:', error);
      return {
        type: 'growth-trends',
        analysis: {
          revenueGrowth: 'Data unavailable',
          profitabilityTrend: 'Unable to analyze',
          growthStability: 'Cannot assess'
        }
      };
    }
  }

  private static analyzeRevenueGrowth(data: any[]): string {
    if (!Array.isArray(data) || !data.length) return 'No growth data available';
    const latestGrowth = data[0];
    return `Revenue Growth: ${(latestGrowth.revenueGrowth * 100).toFixed(2)}%`;
  }

  private static analyzeProfitabilityTrend(data: any[]): string {
    if (!Array.isArray(data) || !data.length) return 'Insufficient data';
    const latestGrowth = data[0];
    
    if (latestGrowth.netIncomeGrowth > 0.2) return 'Strong profit growth';
    if (latestGrowth.netIncomeGrowth > 0) return 'Moderate profit growth';
    return 'Declining profitability';
  }

  private static assessGrowthStability(data: any[]): string {
    if (!Array.isArray(data) || data.length < 3) return 'Insufficient historical data';
    const growthRates = data.slice(0, 3).map(d => d.revenueGrowth);
    const variance = this.calculateVariance(growthRates);
    
    if (variance < 0.05) return 'Very stable';
    if (variance < 0.15) return 'Moderately stable';
    return 'Volatile';
  }

  private static calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    return numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  }
}
