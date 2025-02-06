
export class TechnicalAnalysisAgent {
  static analyze(stockData: any) {
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
    if (price > ma50 && ma50 > ma200) return 'Strong Uptrend';
    if (price < ma50 && ma50 < ma200) return 'Strong Downtrend';
    return 'Mixed Trend';
  }

  private static getVolumeSignal(volume: number, avgVolume: number): string {
    if (volume > avgVolume * 1.5) return 'High Volume - Strong Signal';
    if (volume < avgVolume * 0.5) return 'Low Volume - Weak Signal';
    return 'Normal Volume';
  }

  private static getOverallSignal(price: number, ma50: number, ma200: number, volume: number, avgVolume: number): string {
    const trendStrength = this.getTrendSignal(price, ma50, ma200);
    const volumeStrength = this.getVolumeSignal(volume, avgVolume);
    
    if (trendStrength.includes('Strong') && volumeStrength.includes('Strong')) {
      return 'Strong Buy/Sell Signal';
    }
    return 'Monitor for Better Entry/Exit';
  }
}
