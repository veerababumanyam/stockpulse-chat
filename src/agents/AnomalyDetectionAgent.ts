
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class AnomalyDetectionAgent extends BaseAgent {
  static async analyze(data: any): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const stockData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${data.quote.symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'anomaly-detection',
        analysis: {
          priceAnomalies: this.detectPriceAnomalies(stockData),
          volumeAnomalies: this.detectVolumeAnomalies(stockData),
          patternAnomalies: this.detectPatternAnomalies(stockData),
          riskMetrics: this.calculateRiskMetrics(stockData)
        }
      };
    } catch (error) {
      console.error('Error in anomaly detection:', error);
      return {
        type: 'anomaly-detection',
        analysis: {
          priceAnomalies: [],
          volumeAnomalies: [],
          patternAnomalies: [],
          riskMetrics: {}
        }
      };
    }
  }

  private static detectPriceAnomalies(data: any): string[] {
    const anomalies = [];
    if (!data?.historical) return anomalies;

    const prices = data.historical.map((d: any) => d.close);
    const mean = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const stdDev = Math.sqrt(
      prices.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / prices.length
    );

    data.historical.forEach((day: any, index: number) => {
      if (Math.abs(day.close - mean) > 2 * stdDev) {
        anomalies.push(`Unusual price movement on ${day.date}: ${day.close}`);
      }
    });

    return anomalies;
  }

  private static detectVolumeAnomalies(data: any): string[] {
    const anomalies = [];
    if (!data?.historical) return anomalies;

    const volumes = data.historical.map((d: any) => d.volume);
    const avgVolume = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;

    data.historical.forEach((day: any) => {
      if (day.volume > avgVolume * 2) {
        anomalies.push(`Unusual high volume on ${day.date}: ${day.volume}`);
      }
    });

    return anomalies;
  }

  private static detectPatternAnomalies(data: any): string[] {
    const anomalies = [];
    if (!data?.historical) return anomalies;

    // Detect gap ups/downs
    for (let i = 1; i < data.historical.length; i++) {
      const today = data.historical[i];
      const yesterday = data.historical[i - 1];
      
      const gapPercentage = ((today.open - yesterday.close) / yesterday.close) * 100;
      
      if (Math.abs(gapPercentage) > 3) {
        anomalies.push(
          `Gap ${gapPercentage > 0 ? 'up' : 'down'} of ${Math.abs(gapPercentage).toFixed(2)}% on ${today.date}`
        );
      }
    }

    return anomalies;
  }

  private static calculateRiskMetrics(data: any): any {
    if (!data?.historical) return {};

    const prices = data.historical.map((d: any) => d.close);
    const returns = [];
    
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i-1] - prices[i]) / prices[i]);
    }

    const volatility = Math.sqrt(
      returns.reduce((a: number, b: number) => a + Math.pow(b, 2), 0) / returns.length
    ) * Math.sqrt(252); // Annualized

    return {
      volatility: (volatility * 100).toFixed(2) + '%',
      maxDrawdown: this.calculateMaxDrawdown(prices).toFixed(2) + '%',
      sharpeRatio: this.calculateSharpeRatio(returns).toFixed(2)
    };
  }

  private static calculateMaxDrawdown(prices: number[]): number {
    let maxDrawdown = 0;
    let peak = prices[0];

    for (const price of prices) {
      if (price > peak) {
        peak = price;
      }
      const drawdown = ((peak - price) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  private static calculateSharpeRatio(returns: number[]): number {
    const riskFreeRate = 0.02; // Assuming 2% risk-free rate
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length
    );

    return stdDev !== 0 ? (meanReturn - riskFreeRate) / stdDev : 0;
  }
}
