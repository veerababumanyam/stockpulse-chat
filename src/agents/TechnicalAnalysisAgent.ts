
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
        }
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
}
