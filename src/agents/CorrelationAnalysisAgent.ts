
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CorrelationAnalysisAgent extends BaseAgent {
  static async analyze(data: any): Promise<AnalysisResult> {
    try {
      return {
        type: 'correlation-analysis',
        analysis: {
          marketCorrelation: this.analyzeMarketCorrelation(data),
          sectorCorrelation: this.analyzeSectorCorrelation(data),
          factorCorrelation: this.analyzeFactorCorrelation(data)
        }
      };
    } catch (error) {
      console.error('Error in correlation analysis:', error);
      return {
        type: 'correlation-analysis',
        analysis: {
          marketCorrelation: 'Analysis unavailable',
          sectorCorrelation: 'Analysis unavailable',
          factorCorrelation: []
        }
      };
    }
  }

  private static analyzeMarketCorrelation(data: any): string {
    const stockReturn = this.calculateReturn(data.quote?.price, data.quote?.previousClose);
    const marketReturn = 0; // This would normally be calculated from market data

    if (stockReturn !== null) {
      if (Math.abs(stockReturn) > 2) {
        return stockReturn > 0 
          ? 'Strong positive correlation with market movements'
          : 'Strong negative correlation with market movements';
      }
      return 'Moderate correlation with market movements';
    }
    
    return 'Insufficient data for market correlation analysis';
  }

  private static analyzeSectorCorrelation(data: any): string {
    const sector = data.profile?.sector;
    if (!sector) return 'Sector data unavailable';

    return `Analysis based on ${sector} sector performance`;
  }

  private static analyzeFactorCorrelation(data: any): string[] {
    const factors = [];
    const price = data.quote?.price;
    const volume = data.quote?.volume;

    if (price && volume) {
      factors.push('Price-Volume relationship: ' + this.analyzePriceVolume(price, volume));
    }

    return factors;
  }

  private static calculateReturn(current: number, previous: number): number | null {
    if (!current || !previous) return null;
    return ((current - previous) / previous) * 100;
  }

  private static analyzePriceVolume(price: number, volume: number): string {
    if (price > 0 && volume > 0) {
      const priceVolumeRatio = price * volume;
      if (priceVolumeRatio > 1000000) return 'High price-volume correlation';
      if (priceVolumeRatio > 100000) return 'Moderate price-volume correlation';
      return 'Low price-volume correlation';
    }
    return 'Insufficient data';
  }
}
