
export class TechnicalAnalysisAgent {
  static async analyze(stockData: any): Promise<any> {
    const { quote } = stockData;
    
    const movingAverage50 = quote.priceAvg50;
    const movingAverage200 = quote.priceAvg200;
    const currentPrice = quote.price;
    
    return {
      type: 'technical',
      analysis: {
        priceAction: {
          currentPrice: currentPrice,
          ma50: movingAverage50,
          ma200: movingAverage200,
          relativeStrengthIndex: quote.rsi || 'N/A',
          volume: quote.volume,
          avgVolume: quote.avgVolume
        },
        signals: {
          trendSignal: this.getTrendSignal(currentPrice, movingAverage50, movingAverage200),
          volumeSignal: this.getVolumeSignal(quote.volume, quote.avgVolume),
          overallSignal: this.getOverallSignal(currentPrice, movingAverage50, movingAverage200, quote.volume, quote.avgVolume)
        },
        pricePredictions: {
          threeMonths: this.generatePricePrediction(currentPrice, 3),
          sixMonths: this.generatePricePrediction(currentPrice, 6),
          twelveMonths: this.generatePricePrediction(currentPrice, 12),
          twentyFourMonths: this.generatePricePrediction(currentPrice, 24)
        },
        confidenceScore: this.calculateConfidenceScore(quote)
      }
    };
  }

  private static getTrendSignal(price: number, ma50: number, ma200: number): string {
    if (price > ma50 && ma50 > ma200) {
      const strength = ((price - ma200) / ma200) * 100;
      if (strength > 10) return 'Very Strong Uptrend';
      return 'Strong Uptrend';
    }
    if (price < ma50 && ma50 < ma200) {
      const strength = ((ma200 - price) / ma200) * 100;
      if (strength > 10) return 'Very Strong Downtrend';
      return 'Strong Downtrend';
    }
    if (price > ma50) return 'Bullish';
    if (price < ma50) return 'Bearish';
    return 'Neutral';
  }

  private static getVolumeSignal(volume: number, avgVolume: number): string {
    const volumeRatio = volume / avgVolume;
    if (volumeRatio > 2.0) return 'Extremely High Volume';
    if (volumeRatio > 1.5) return 'High Volume';
    if (volumeRatio < 0.5) return 'Very Low Volume';
    if (volumeRatio < 0.75) return 'Low Volume';
    return 'Normal Volume';
  }

  private static getOverallSignal(price: number, ma50: number, ma200: number, volume: number, avgVolume: number): string {
    const trendStrength = this.getTrendSignal(price, ma50, ma200);
    const volumeStrength = this.getVolumeSignal(volume, avgVolume);
    
    // Strong Buy Signals
    if ((trendStrength.includes('Strong Uptrend') || trendStrength === 'Bullish') && 
        (volumeStrength.includes('High') || volumeStrength.includes('Extremely'))) {
      return 'Strong Buy';
    }
    
    // Strong Sell Signals
    if ((trendStrength.includes('Strong Downtrend') || trendStrength === 'Bearish') && 
        (volumeStrength.includes('High') || volumeStrength.includes('Extremely'))) {
      return 'Strong Sell';
    }
    
    // Buy Signals
    if (trendStrength.includes('Uptrend') || trendStrength === 'Bullish') {
      return 'Buy';
    }
    
    // Sell Signals
    if (trendStrength.includes('Downtrend') || trendStrength === 'Bearish') {
      return 'Sell';
    }

    return price > ma50 ? 'Buy with Caution' : 'Sell with Caution';
  }

  private static generatePricePrediction(currentPrice: number, months: number): {
    price: number;
    confidence: number;
  } {
    // This is a simplified prediction model
    const volatility = 0.2; // 20% annual volatility
    const monthlyVolatility = volatility / Math.sqrt(12);
    const randomFactor = 1 + (Math.random() - 0.5) * monthlyVolatility * months;
    const trendFactor = 1 + (months / 12) * 0.08; // Assuming 8% annual trend

    return {
      price: Number((currentPrice * randomFactor * trendFactor).toFixed(2)),
      confidence: Number((100 - (months * 2)).toFixed(2)) // Confidence decreases with time
    };
  }

  private static calculateConfidenceScore(quote: any): number {
    let score = 70; // Base score

    // Adjust based on RSI
    if (quote.rsi) {
      if (quote.rsi > 70 || quote.rsi < 30) score += 10;
      else if (quote.rsi > 60 || quote.rsi < 40) score += 5;
    }

    // Adjust based on volume
    const volumeRatio = quote.volume / quote.avgVolume;
    if (volumeRatio > 2) score += 15;
    else if (volumeRatio > 1.5) score += 10;
    else if (volumeRatio < 0.5) score -= 10;

    // Ensure score stays within 0-100 range
    return Math.min(100, Math.max(0, score));
  }
}
