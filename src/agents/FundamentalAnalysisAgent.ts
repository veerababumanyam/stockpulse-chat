
export class FundamentalAnalysisAgent {
  static analyze(stockData: any) {
    const { quote, profile } = stockData;
    
    const peRatio = quote.price / (profile.eps || 1);
    const debtToEquity = profile.debtToEquityRatio;
    
    return {
      type: 'fundamental',
      analysis: {
        valuationMetrics: {
          peRatio: peRatio.toFixed(2),
          marketCap: quote.marketCap,
          enterpriseValue: profile.mktCap,
        },
        financialHealth: {
          currentRatio: profile.currentRatio,
          debtToEquity: debtToEquity,
          quickRatio: profile.quickRatio
        },
        profitability: {
          grossMargin: profile.grossMargin,
          operatingMargin: profile.operatingMargin,
          netMargin: profile.netMargin
        },
        recommendation: this.getFundamentalRecommendation(peRatio, debtToEquity)
      }
    };
  }

  private static getFundamentalRecommendation(peRatio: number, debtToEquity: number): string {
    let recommendation = '';
    
    if (peRatio < 15) {
      recommendation += 'Potentially undervalued based on P/E ratio. ';
    } else if (peRatio > 30) {
      recommendation += 'Relatively high P/E ratio indicates possible overvaluation. ';
    }
    
    if (debtToEquity < 1) {
      recommendation += 'Healthy debt levels. ';
    } else {
      recommendation += 'High debt levels - exercise caution. ';
    }
    
    return recommendation;
  }
}
