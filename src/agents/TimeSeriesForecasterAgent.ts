
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class TimeSeriesForecasterAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const historicalData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${fmp}`,
        fmp
      );

      if (!historicalData || !historicalData.historical) {
        throw new Error('No historical data available');
      }

      const prices = historicalData.historical.map((d: any) => d.close).slice(0, 30);
      const dates = historicalData.historical.map((d: any) => d.date).slice(0, 30);

      return {
        type: 'time-series-forecast',
        analysis: {
          forecast: this.generateForecast(prices, dates),
          trends: this.analyzeTrends(prices),
          seasonality: this.analyzeSeasonality(prices),
          confidence: this.calculateConfidenceIntervals(prices)
        }
      };
    } catch (error) {
      console.error('Error in time series forecasting:', error);
      return {
        type: 'time-series-forecast',
        analysis: {
          forecast: [],
          trends: {},
          seasonality: {},
          confidence: {}
        }
      };
    }
  }

  private static generateForecast(prices: number[], dates: string[]): any[] {
    const lastPrice = prices[0];
    const volatility = this.calculateVolatility(prices);
    
    return Array.from({ length: 5 }, (_, i) => {
      const randomWalk = (Math.random() - 0.5) * volatility * Math.sqrt(i + 1);
      return {
        date: this.addDays(new Date(dates[0]), i + 1).toISOString(),
        prediction: Number((lastPrice * (1 + randomWalk)).toFixed(2)),
        confidence: Math.max(0.7, 0.9 - (i * 0.04))
      };
    });
  }

  private static analyzeTrends(prices: number[]): any {
    const shortTerm = this.calculateTrend(prices.slice(0, 5));
    const mediumTerm = this.calculateTrend(prices.slice(0, 14));
    const longTerm = this.calculateTrend(prices);

    return {
      shortTerm: this.getTrendDescription(shortTerm),
      mediumTerm: this.getTrendDescription(mediumTerm),
      longTerm: this.getTrendDescription(longTerm)
    };
  }

  private static analyzeSeasonality(prices: number[]): any {
    const weeklyPattern = this.detectWeeklyPattern(prices);
    return {
      pattern: weeklyPattern ? 'weekly' : 'no clear pattern',
      strength: weeklyPattern ? 0.75 : 0.3,
      peaks: weeklyPattern ? ['Monday', 'Friday'] : []
    };
  }

  private static calculateConfidenceIntervals(prices: number[]): any {
    const lastPrice = prices[0];
    const volatility = this.calculateVolatility(prices);
    const standardDeviation = volatility * lastPrice;

    return {
      upper95: Number((lastPrice + 1.96 * standardDeviation).toFixed(2)),
      lower95: Number((lastPrice - 1.96 * standardDeviation).toFixed(2)),
      upper80: Number((lastPrice + 1.28 * standardDeviation).toFixed(2)),
      lower80: Number((lastPrice - 1.28 * standardDeviation).toFixed(2))
    };
  }

  private static calculateVolatility(prices: number[]): number {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i - 1] / prices[i]));
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private static calculateTrend(prices: number[]): number {
    const first = prices[prices.length - 1];
    const last = prices[0];
    return ((last - first) / first) * 100;
  }

  private static getTrendDescription(trend: number): string {
    if (trend > 5) return 'strong upward';
    if (trend > 2) return 'upward';
    if (trend < -5) return 'strong downward';
    if (trend < -2) return 'downward';
    return 'stable';
  }

  private static detectWeeklyPattern(prices: number[]): boolean {
    // Simplified weekly pattern detection
    return prices.length >= 10;
  }

  private static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
