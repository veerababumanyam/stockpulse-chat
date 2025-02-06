
export class SignalAnalyzer {
  static getConsolidatedSignal(data: any): string {
    let buySignals = 0;
    let sellSignals = 0;
    let totalSignals = 0;

    // Technical Analysis
    if (data.results.technical?.data?.analysis.signals?.overallSignal) {
      totalSignals++;
      const signal = data.results.technical.data.analysis.signals.overallSignal.toLowerCase();
      if (signal.includes('buy')) buySignals++;
      if (signal.includes('sell')) sellSignals++;
    }

    // Fundamental Analysis
    if (data.results.fundamental?.data?.analysis.recommendation) {
      totalSignals++;
      const rec = data.results.fundamental.data.analysis.recommendation.toLowerCase();
      if (rec.includes('undervalued') || rec.includes('buy')) buySignals++;
      if (rec.includes('overvalued') || rec.includes('sell')) sellSignals++;
    }

    // Sentiment Analysis
    if (data.results.sentiment?.data?.analysis.overallSentiment) {
      totalSignals++;
      const sentiment = data.results.sentiment.data.analysis.overallSentiment.toLowerCase();
      if (sentiment.includes('positive')) buySignals++;
      if (sentiment.includes('negative')) sellSignals++;
    }

    // Risk Assessment
    if (data.results.risk?.data?.analysis.riskLevel) {
      totalSignals++;
      const risk = data.results.risk.data.analysis.riskLevel.toLowerCase();
      if (risk === 'low') buySignals++;
      if (risk === 'high') sellSignals++;
    }

    // Valuation Analysis
    if (data.results.valuation?.data?.analysis.intrinsicValue) {
      totalSignals++;
      const valuation = data.results.valuation.data.analysis.intrinsicValue.toLowerCase();
      if (valuation.includes('undervalued')) buySignals++;
      if (valuation.includes('overvalued')) sellSignals++;
    }

    const buyPercentage = (buySignals / totalSignals) * 100;
    const sellPercentage = (sellSignals / totalSignals) * 100;

    if (buyPercentage > 60) return '🟢 STRONG BUY';
    if (buyPercentage > 40) return '🟡 MODERATE BUY';
    if (sellPercentage > 60) return '🔴 STRONG SELL';
    if (sellPercentage > 40) return '🟠 MODERATE SELL';
    return '⚪ HOLD';
  }
}
