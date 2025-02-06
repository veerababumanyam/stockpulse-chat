
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class AnomalyDetectionAgent extends BaseAgent {
  static async analyze(data: any): Promise<AnalysisResult> {
    try {
      return {
        type: 'anomaly-detection',
        analysis: {
          priceAnomalies: this.detectPriceAnomalies(data),
          volumeAnomalies: this.detectVolumeAnomalies(data),
          patternAnomalies: this.detectPatternAnomalies(data)
        }
      };
    } catch (error) {
      console.error('Error in anomaly detection:', error);
      return {
        type: 'anomaly-detection',
        analysis: {
          priceAnomalies: [],
          volumeAnomalies: [],
          patternAnomalies: []
        }
      };
    }
  }

  private static detectPriceAnomalies(data: any): string[] {
    const anomalies = [];
    const price = data.quote?.price;
    const previousClose = data.quote?.previousClose;

    if (price && previousClose) {
      const priceChange = ((price - previousClose) / previousClose) * 100;
      if (Math.abs(priceChange) > 10) {
        anomalies.push(`Significant price change of ${priceChange.toFixed(2)}%`);
      }
    }

    return anomalies;
  }

  private static detectVolumeAnomalies(data: any): string[] {
    const anomalies = [];
    const volume = data.quote?.volume;
    const avgVolume = data.quote?.avgVolume;

    if (volume && avgVolume) {
      const volumeRatio = volume / avgVolume;
      if (volumeRatio > 2) {
        anomalies.push(`Unusual high volume: ${volumeRatio.toFixed(2)}x average`);
      }
    }

    return anomalies;
  }

  private static detectPatternAnomalies(data: any): string[] {
    const anomalies = [];
    const price = data.quote?.price;
    const high = data.quote?.dayHigh;
    const low = data.quote?.dayLow;

    if (price && high && low) {
      const volatility = (high - low) / price * 100;
      if (volatility > 5) {
        anomalies.push(`High intraday volatility: ${volatility.toFixed(2)}%`);
      }
    }

    return anomalies;
  }
}
