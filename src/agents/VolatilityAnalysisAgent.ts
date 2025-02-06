
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class VolatilityAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const volatilityResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'volatility',
        analysis: {
          historicalVolatility: this.calculateHistoricalVolatility(volatilityResponse),
          volatilityTrend: this.analyzeVolatilityTrend(volatilityResponse),
          riskMetrics: this.calculateRiskMetrics(volatilityResponse)
        }
      };
    } catch (error) {
      console.error('Error in volatility analysis:', error);
      return {
        type: 'volatility',
        analysis: {
          historicalVolatility: 'Unable to calculate',
          volatilityTrend: 'Data unavailable',
          riskMetrics: {}
        }
      };
    }
  }

  private static calculateHistoricalVolatility(data: any): string {
    if (!data || !data.historical || !Array.isArray(data.historical)) {
      return 'No historical data available';
    }

    const returns = [];
    for (let i = 1; i < data.historical.length; i++) {
      const currentPrice = data.historical[i].close;
      const previousPrice = data.historical[i - 1].close;
      returns.push(Math.log(currentPrice / previousPrice));
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance * 252) * 100; // Annualized volatility

    return `${volatility.toFixed(2)}%`;
  }

  private static analyzeVolatilityTrend(data: any): string {
    if (!data || !data.historical || !Array.isArray(data.historical)) {
      return 'Cannot analyze volatility trend';
    }

    const recentVolatility = this.calculateVolatilityForPeriod(data.historical.slice(0, 30));
    const previousVolatility = this.calculateVolatilityForPeriod(data.historical.slice(30, 60));

    if (recentVolatility > previousVolatility * 1.2) return 'Increasing';
    if (recentVolatility < previousVolatility * 0.8) return 'Decreasing';
    return 'Stable';
  }

  private static calculateVolatilityForPeriod(prices: any[]): number {
    if (prices.length < 2) return 0;
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i].close / prices[i - 1].close));
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    return Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length);
  }

  private static calculateRiskMetrics(data: any): any {
    if (!data || !data.historical || !Array.isArray(data.historical)) {
      return {};
    }

    const prices = data.historical.map((d: any) => d.close);
    const returns = prices.slice(1).map((p: number, i: number) => (p - prices[i]) / prices[i]);
    
    return {
      maxDrawdown: this.calculateMaxDrawdown(prices),
      sharpeRatio: this.calculateSharpeRatio(returns)
    };
  }

  private static calculateMaxDrawdown(prices: number[]): string {
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (const price of prices) {
      if (price > peak) peak = price;
      const drawdown = (peak - price) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    return `${(maxDrawdown * 100).toFixed(2)}%`;
  }

  private static calculateSharpeRatio(returns: number[]): string {
    const riskFreeRate = 0.02; // Assuming 2% risk-free rate
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length);
    const sharpeRatio = (mean - riskFreeRate) / stdDev;
    return sharpeRatio.toFixed(2);
  }
}
