
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { generatePricePrediction } from './utils/pricePrediction';

export class DeepLearningAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const stockData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${fmp}`,
        fmp
      );

      if (!stockData || !stockData[0]) {
        throw new Error('No stock data available');
      }

      const currentPrice = stockData[0].price;
      const baseConfidence = 85; // Starting confidence for short-term predictions

      const predictions = {
        shortTerm: generatePricePrediction(currentPrice, 1, baseConfidence),
        mediumTerm: generatePricePrediction(currentPrice, 3, baseConfidence),
        longTerm: generatePricePrediction(currentPrice, 6, baseConfidence)
      };

      return {
        type: 'deep-learning',
        analysis: {
          predictions,
          featureImportance: this.calculateFeatureImportance(),
          modelConfidence: this.assessModelConfidence(predictions),
          predictionFactors: this.getPredictionFactors()
        }
      };
    } catch (error) {
      console.error('Error in deep learning analysis:', error);
      return {
        type: 'deep-learning',
        analysis: {
          predictions: {},
          featureImportance: [],
          modelConfidence: 0,
          predictionFactors: []
        }
      };
    }
  }

  private static calculateFeatureImportance(): string[] {
    return [
      'Historical Price Patterns',
      'Volume Analysis',
      'Market Sentiment Indicators',
      'Technical Indicators',
      'Fundamental Metrics'
    ];
  }

  private static assessModelConfidence(predictions: any): number {
    const confidences = [
      predictions.shortTerm.confidence,
      predictions.mediumTerm.confidence,
      predictions.longTerm.confidence
    ];
    return Number((confidences.reduce((a, b) => a + b, 0) / 3).toFixed(2));
  }

  private static getPredictionFactors(): string[] {
    return [
      'Price Momentum',
      'Market Volatility',
      'Trading Volume Trends',
      'Market Sentiment Analysis',
      'Technical Pattern Recognition'
    ];
  }
}
