
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class SeasonalityAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${fmp}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }

      const data = await response.json();
      console.log('Historical data for seasonality:', data);

      return {
        type: 'seasonality',
        analysis: {
          signals: {
            overallSignal: this.analyzeSeasonalPattern(data),
          },
          patterns: {
            quarterly: this.analyzeQuarterlyPatterns(data),
            monthly: this.analyzeMonthlyPatterns(data),
          },
          seasonalStrength: this.calculateSeasonalStrength(data)
        }
      };
    } catch (error) {
      console.error('Error in seasonality analysis:', error);
      return {
        type: 'seasonality',
        analysis: {
          signals: {
            overallSignal: 'NEUTRAL'
          },
          patterns: {},
          seasonalStrength: 'Unknown'
        }
      };
    }
  }

  private static analyzeSeasonalPattern(data: any): string {
    if (!data.historical || !Array.isArray(data.historical)) return 'HOLD';
    
    const currentMonth = new Date().getMonth();
    const historicalPerformance = this.getHistoricalMonthPerformance(data.historical, currentMonth);
    
    if (historicalPerformance > 5) return 'BUY';
    if (historicalPerformance < -5) return 'SELL';
    return 'HOLD';
  }

  private static getHistoricalMonthPerformance(historical: any[], month: number): number {
    const monthlyReturns = historical
      .filter(day => new Date(day.date).getMonth() === month)
      .map(day => day.changePercent || 0);
    
    return monthlyReturns.reduce((acc, val) => acc + val, 0) / monthlyReturns.length;
  }

  private static analyzeQuarterlyPatterns(data: any): any {
    return {
      Q1: 'Analysis pending',
      Q2: 'Analysis pending',
      Q3: 'Analysis pending',
      Q4: 'Analysis pending'
    };
  }

  private static analyzeMonthlyPatterns(data: any): any {
    return {
      bestMonth: 'Analysis pending',
      worstMonth: 'Analysis pending'
    };
  }

  private static calculateSeasonalStrength(data: any): string {
    return 'Moderate';
  }
}
