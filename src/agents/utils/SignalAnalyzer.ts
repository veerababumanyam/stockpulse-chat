
export class SignalAnalyzer {
  static getConsolidatedSignal(data: any): string {
    let buySignals = 0;
    let sellSignals = 0;
    let totalSignals = 0;

    console.log('Analyzing signals for data:', data);

    // Technical Analysis
    if (data.results.technical?.analysis?.signals?.overallSignal) {
      totalSignals++;
      const signal = data.results.technical.analysis.signals.overallSignal.toLowerCase();
      console.log('Technical signal:', signal);
      if (signal.includes('buy')) buySignals++;
      if (signal.includes('sell')) sellSignals++;
    }

    // Fundamental Analysis
    if (data.results.fundamental?.analysis?.summary?.recommendation) {
      totalSignals++;
      const rec = data.results.fundamental.analysis.summary.recommendation.toLowerCase();
      console.log('Fundamental recommendation:', rec);
      if (rec.includes('buy') || rec.includes('undervalued')) buySignals++;
      if (rec.includes('sell') || rec.includes('overvalued')) sellSignals++;
    }

    // Sentiment Analysis
    if (data.results.sentiment?.analysis?.overallSentiment) {
      totalSignals++;
      const sentiment = data.results.sentiment.analysis.overallSentiment.toLowerCase();
      console.log('Sentiment analysis:', sentiment);
      if (sentiment.includes('bullish') || sentiment.includes('positive')) buySignals++;
      if (sentiment.includes('bearish') || sentiment.includes('negative')) sellSignals++;
    }

    // Risk Assessment
    if (data.results.risk?.analysis?.riskLevel) {
      totalSignals++;
      const risk = data.results.risk.analysis.riskLevel.toLowerCase();
      console.log('Risk level:', risk);
      if (risk === 'low') buySignals += 0.5;
      if (risk === 'high') sellSignals += 0.5;
    }

    // Analyst Recommendations
    if (data.results.analyst?.analysis?.consensus) {
      totalSignals++;
      const consensus = data.results.analyst.analysis.consensus.toLowerCase();
      console.log('Analyst consensus:', consensus);
      if (consensus.includes('buy')) buySignals++;
      if (consensus.includes('sell')) sellSignals++;
    }

    // Growth Trends
    if (data.results.growthTrends?.analysis?.outlook) {
      totalSignals++;
      const growth = data.results.growthTrends.analysis.outlook.toLowerCase();
      console.log('Growth outlook:', growth);
      if (growth.includes('positive') || growth.includes('strong')) buySignals++;
      if (growth.includes('negative') || growth.includes('weak')) sellSignals++;
    }

    // Valuation Analysis
    if (data.results.valuation?.analysis?.status) {
      totalSignals++;
      const valuation = data.results.valuation.analysis.status.toLowerCase();
      console.log('Valuation status:', valuation);
      if (valuation.includes('undervalued')) buySignals++;
      if (valuation.includes('overvalued')) sellSignals++;
    }

    // Market Sentiment
    if (data.results.marketSentiment?.analysis?.overallSentiment) {
      totalSignals++;
      const marketSentiment = data.results.marketSentiment.analysis.overallSentiment.toLowerCase();
      console.log('Market sentiment:', marketSentiment);
      if (marketSentiment.includes('bullish')) buySignals++;
      if (marketSentiment.includes('bearish')) sellSignals++;
    }

    // Cash Flow Analysis
    if (data.results.cashFlow?.analysis?.status) {
      totalSignals++;
      const cashFlow = data.results.cashFlow.analysis.status.toLowerCase();
      console.log('Cash flow status:', cashFlow);
      if (cashFlow.includes('strong') || cashFlow.includes('positive')) buySignals++;
      if (cashFlow.includes('weak') || cashFlow.includes('negative')) sellSignals++;
    }

    console.log(`Total signals: ${totalSignals}, Buy signals: ${buySignals}, Sell signals: ${sellSignals}`);

    // Calculate percentages only if we have signals
    if (totalSignals > 0) {
      const buyPercentage = (buySignals / totalSignals) * 100;
      const sellPercentage = (sellSignals / totalSignals) * 100;
      const neutralPercentage = 100 - buyPercentage - sellPercentage;

      console.log(`Buy percentage: ${buyPercentage}%, Sell percentage: ${sellPercentage}%, Neutral percentage: ${neutralPercentage}%`);

      // Strong signals require higher thresholds
      if (buyPercentage >= 60) return '🟢 STRONG BUY';
      if (buyPercentage >= 45) return '🟡 MODERATE BUY';
      if (sellPercentage >= 60) return '🔴 STRONG SELL';
      if (sellPercentage >= 45) return '🟠 MODERATE SELL';
      if (neutralPercentage >= 40 || (buyPercentage < 45 && sellPercentage < 45)) return '⚪ HOLD';
      
      // If buy signals are slightly stronger
      if (buyPercentage > sellPercentage) return '🟡 MODERATE BUY';
      // If sell signals are slightly stronger
      if (sellPercentage > buyPercentage) return '🟠 MODERATE SELL';
    }

    // Default to HOLD if we don't have enough signals
    return '⚪ HOLD';
  }
}
