
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CorrelationAnalysisAgent extends BaseAgent {
  static async analyze(data: any): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const symbol = data.quote.symbol;
      const [stockData, spyData] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/historical-price-full/SPY?apikey=${fmp}`,
          fmp
        )
      ]);

      return {
        type: 'correlation-analysis',
        analysis: {
          marketCorrelation: this.analyzeMarketCorrelation(stockData, spyData),
          sectorCorrelation: this.analyzeSectorCorrelation(data),
          volatilityAnalysis: this.analyzeVolatility(stockData),
          correlationMetrics: this.calculateCorrelationMetrics(stockData, spyData)
        }
      };
    } catch (error) {
      console.error('Error in correlation analysis:', error);
      return {
        type: 'correlation-analysis',
        analysis: {
          marketCorrelation: {},
          sectorCorrelation: {},
          volatilityAnalysis: {},
          correlationMetrics: {}
        }
      };
    }
  }

  private static analyzeMarketCorrelation(stockData: any, spyData: any): any {
    if (!stockData?.historical || !spyData?.historical) return {};

    const stockReturns = this.calculateReturns(stockData.historical.map((d: any) => d.close));
    const spyReturns = this.calculateReturns(spyData.historical.map((d: any) => d.close));

    const correlation = this.calculateCorrelation(stockReturns, spyReturns);
    const beta = this.calculateBeta(stockReturns, spyReturns);

    return {
      correlation: correlation.toFixed(2),
      beta: beta.toFixed(2),
      interpretation: this.interpretCorrelation(correlation),
      riskAssessment: this.assessRisk(beta)
    };
  }

  private static analyzeSectorCorrelation(data: any): any {
    const sector = data.profile?.sector || 'Unknown';
    const industry = data.profile?.industry || 'Unknown';

    return {
      sector,
      industry,
      sectorBehavior: 'Cyclical', // This would ideally be calculated from sector data
      industryTrend: 'Growing'     // This would ideally be calculated from industry data
    };
  }

  private static analyzeVolatility(stockData: any): any {
    if (!stockData?.historical) return {};

    const prices = stockData.historical.map((d: any) => d.close);
    const returns = this.calculateReturns(prices);
    const volatility = Math.sqrt(
      returns.reduce((a: number, b: number) => a + Math.pow(b, 2), 0) / returns.length
    ) * Math.sqrt(252); // Annualized

    return {
      volatility: (volatility * 100).toFixed(2) + '%',
      interpretation: this.interpretVolatility(volatility)
    };
  }

  private static calculateCorrelationMetrics(stockData: any, spyData: any): any {
    if (!stockData?.historical || !spyData?.historical) return {};

    const stockPrices = stockData.historical.map((d: any) => d.close);
    const spyPrices = spyData.historical.map((d: any) => d.close);

    const shortTermCorr = this.calculateCorrelation(
      this.calculateReturns(stockPrices.slice(0, 30)),
      this.calculateReturns(spyPrices.slice(0, 30))
    );

    const longTermCorr = this.calculateCorrelation(
      this.calculateReturns(stockPrices),
      this.calculateReturns(spyPrices)
    );

    return {
      shortTerm: shortTermCorr.toFixed(2),
      longTerm: longTermCorr.toFixed(2),
      trend: this.compareSensitivity(shortTermCorr, longTermCorr)
    };
  }

  private static calculateReturns(prices: number[]): number[] {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i-1] - prices[i]) / prices[i]);
    }
    return returns;
  }

  private static calculateBeta(stockReturns: number[], marketReturns: number[]): number {
    const covariance = this.calculateCovariance(stockReturns, marketReturns);
    const marketVariance = this.calculateVariance(marketReturns);
    return marketVariance !== 0 ? covariance / marketVariance : 1;
  }

  private static calculateCovariance(array1: number[], array2: number[]): number {
    const mean1 = array1.reduce((a, b) => a + b, 0) / array1.length;
    const mean2 = array2.reduce((a, b) => a + b, 0) / array2.length;
    
    const sum = array1.reduce((a, b, i) => a + (b - mean1) * (array2[i] - mean2), 0);
    return sum / array1.length;
  }

  private static calculateVariance(array: number[]): number {
    const mean = array.reduce((a, b) => a + b, 0) / array.length;
    return array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
  }

  private static interpretCorrelation(correlation: number): string {
    if (correlation > 0.7) return 'Strong positive correlation with market';
    if (correlation > 0.3) return 'Moderate positive correlation with market';
    if (correlation > -0.3) return 'Weak correlation with market';
    if (correlation > -0.7) return 'Moderate negative correlation with market';
    return 'Strong negative correlation with market';
  }

  private static assessRisk(beta: number): string {
    if (beta > 1.5) return 'High market sensitivity';
    if (beta > 0.5) return 'Moderate market sensitivity';
    return 'Low market sensitivity';
  }

  private static interpretVolatility(volatility: number): string {
    if (volatility > 0.4) return 'High volatility';
    if (volatility > 0.2) return 'Moderate volatility';
    return 'Low volatility';
  }

  private static compareSensitivity(shortTerm: number, longTerm: number): string {
    const diff = shortTerm - longTerm;
    if (Math.abs(diff) < 0.1) return 'Stable market sensitivity';
    return diff > 0 ? 'Increasing market sensitivity' : 'Decreasing market sensitivity';
  }
}
