
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class DividendAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const dividendResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'dividend',
        analysis: {
          dividendYield: this.calculateDividendYield(dividendResponse),
          payoutRatio: this.analyzeDividendPayout(dividendResponse),
          dividendGrowth: this.analyzeDividendGrowth(dividendResponse)
        }
      };
    } catch (error) {
      console.error('Error in dividend analysis:', error);
      return {
        type: 'dividend',
        analysis: {
          dividendYield: 'Unable to calculate',
          payoutRatio: 'Data unavailable',
          dividendGrowth: 'Cannot analyze'
        }
      };
    }
  }

  private static calculateDividendYield(data: any): string {
    if (!data || !data.historical || !data.historical.length) {
      return 'No dividend data available';
    }

    const annualDividend = data.historical.slice(0, 4)
      .reduce((sum: number, div: any) => sum + (div.dividend || 0), 0);
    
    return `${(annualDividend * 100).toFixed(2)}%`;
  }

  private static analyzeDividendPayout(data: any): string {
    if (!data || !data.historical || !data.historical.length) {
      return 'No payout data available';
    }

    const latestDividend = data.historical[0].dividend;
    if (!latestDividend) return 'No recent dividends';
    
    // Simple categorization based on dividend amount
    if (latestDividend > 0.05) return 'High payout';
    if (latestDividend > 0.02) return 'Moderate payout';
    return 'Low payout';
  }

  private static analyzeDividendGrowth(data: any): string {
    if (!data || !data.historical || data.historical.length < 8) {
      return 'Insufficient dividend history';
    }

    const recentDividends = data.historical.slice(0, 8).map((d: any) => d.dividend || 0);
    const growthRate = this.calculateDividendGrowthRate(recentDividends);
    
    if (growthRate > 0.1) return 'Strong growth';
    if (growthRate > 0) return 'Stable growth';
    return 'Declining';
  }

  private static calculateDividendGrowthRate(dividends: number[]): number {
    if (dividends[dividends.length - 1] === 0) return 0;
    return (dividends[0] - dividends[dividends.length - 1]) / dividends[dividends.length - 1];
  }
}
