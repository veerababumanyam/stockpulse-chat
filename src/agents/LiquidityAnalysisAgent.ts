
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class LiquidityAnalysisAgent extends BaseAgent {
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
        throw new Error('Failed to fetch liquidity data');
      }

      const data = await response.json();
      console.log('Liquidity data:', data);

      return {
        type: 'liquidity',
        analysis: {
          signals: {
            overallSignal: this.determineLiquiditySignal(data),
          },
          metrics: {
            volumeAnalysis: this.analyzeVolume(data),
            spreadAnalysis: this.analyzeSpread(data),
            turnoverRate: this.calculateTurnoverRate(data)
          },
          riskAssessment: this.assessLiquidityRisk(data)
        }
      };
    } catch (error) {
      console.error('Error in liquidity analysis:', error);
      return {
        type: 'liquidity',
        analysis: {
          signals: {
            overallSignal: 'NEUTRAL'
          },
          metrics: {},
          riskAssessment: 'Unable to assess'
        }
      };
    }
  }

  private static determineLiquiditySignal(data: any): string {
    if (!data.historical || !Array.isArray(data.historical)) return 'HOLD';
    
    const recentVolume = this.calculateAverageVolume(data.historical.slice(0, 30));
    const historicalVolume = this.calculateAverageVolume(data.historical);
    
    if (recentVolume > historicalVolume * 1.5) return 'STRONG BUY';
    if (recentVolume > historicalVolume * 1.2) return 'BUY';
    if (recentVolume < historicalVolume * 0.5) return 'STRONG SELL';
    if (recentVolume < historicalVolume * 0.8) return 'SELL';
    return 'HOLD';
  }

  private static calculateAverageVolume(data: any[]): number {
    if (!data.length) return 0;
    return data.reduce((acc, day) => acc + (day.volume || 0), 0) / data.length;
  }

  private static analyzeVolume(data: any): any {
    return {
      averageVolume: 'Calculating...',
      volumeTrend: 'Analyzing...'
    };
  }

  private static analyzeSpread(data: any): any {
    return {
      averageSpread: 'Data not available',
      spreadTrend: 'Analysis pending'
    };
  }

  private static calculateTurnoverRate(data: any): string {
    return 'Calculating...';
  }

  private static assessLiquidityRisk(data: any): string {
    return 'Moderate';
  }
}
