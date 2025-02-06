
import { FundamentalAnalysisAgent } from './FundamentalAnalysisAgent';
import { TechnicalAnalysisAgent } from './TechnicalAnalysisAgent';
import { NewsAnalysisAgent } from './NewsAnalysisAgent';
import { AnalystRecommendationsAgent } from './AnalystRecommendationsAgent';

export class OrchestratorAgent {
  static async orchestrateAnalysis(stockData: any) {
    try {
      // Run all analyses in parallel
      const [
        fundamentalAnalysis,
        technicalAnalysis,
        newsAnalysis,
        analystAnalysis
      ] = await Promise.all([
        FundamentalAnalysisAgent.analyze(stockData),
        TechnicalAnalysisAgent.analyze(stockData),
        NewsAnalysisAgent.analyze(stockData.quote.symbol),
        AnalystRecommendationsAgent.analyze(stockData.quote.symbol)
      ]);

      // Combine all analyses into a formatted output
      return this.formatOutput({
        symbol: stockData.quote.symbol,
        companyName: stockData.profile.companyName,
        fundamental: fundamentalAnalysis,
        technical: technicalAnalysis,
        news: newsAnalysis,
        analyst: analystAnalysis
      });
    } catch (error) {
      console.error('Error in orchestration:', error);
      return 'Error analyzing stock data. Please try again.';
    }
  }

  private static formatOutput(data: any): string {
    // Filter out sections with no data
    const hasNews = data.news.analysis.recentNews && data.news.analysis.recentNews.length > 0;
    const hasRecommendations = data.analyst.analysis.recommendations && data.analyst.analysis.recommendations.length > 0;
    const hasEstimates = data.analyst.analysis.estimates && data.analyst.analysis.estimates.length > 0;

    return `
📊 Analysis Report for ${data.companyName} (${data.symbol})

🔎 Fundamental Analysis
------------------------
${data.fundamental.analysis.valuationMetrics ? `Valuation Metrics:
• P/E Ratio: ${data.fundamental.analysis.valuationMetrics.peRatio || 'N/A'}
• Market Cap: ${data.fundamental.analysis.valuationMetrics.marketCap ? this.formatLargeNumber(data.fundamental.analysis.valuationMetrics.marketCap) : 'N/A'}` : 'Valuation metrics not available'}

${data.fundamental.analysis.financialHealth ? `Financial Health:
• Debt to Equity: ${data.fundamental.analysis.financialHealth.debtToEquity || 'N/A'}
• Current Ratio: ${data.fundamental.analysis.financialHealth.currentRatio || 'N/A'}` : 'Financial health metrics not available'}

Recommendation: ${data.fundamental.analysis.recommendation || 'No recommendation available'}

📈 Technical Analysis
------------------------
${data.technical.analysis.priceAction ? `Price Action:
• Current Price: $${data.technical.analysis.priceAction.currentPrice || 'N/A'}
• 50-day MA: $${data.technical.analysis.priceAction.ma50 || 'N/A'}
• 200-day MA: $${data.technical.analysis.priceAction.ma200 || 'N/A'}` : 'Price action data not available'}

${data.technical.analysis.signals ? `Signals:
• Trend: ${data.technical.analysis.signals.trendSignal || 'N/A'}
• Volume: ${data.technical.analysis.signals.volumeSignal || 'N/A'}
• Overall: ${data.technical.analysis.signals.overallSignal || 'N/A'}` : 'Technical signals not available'}

${hasNews ? `📰 Recent News Analysis
------------------------
${data.news.analysis.recentNews.map((news: any) => `
${news.date}: ${news.title}
${news.summary || ''}
Sentiment: ${news.sentiment}
`).join('\n')}

Overall News Sentiment: ${data.news.analysis.overallSentiment}` : ''}

${hasRecommendations || hasEstimates ? `👥 Analyst Coverage
------------------------
${hasRecommendations ? `Recent Recommendations:
${data.analyst.analysis.recommendations.map((rec: any) => `
${rec.date}: ${rec.company}
• Recommendation: ${rec.recommendation}
• Target Price: ${rec.targetPrice ? `$${rec.targetPrice}` : 'Not provided'}
`).join('\n')}` : 'No recent analyst recommendations available'}

${hasEstimates ? `Recent Estimates:
${data.analyst.analysis.estimates.map((est: any) => `
${est.date}:
• EPS: ${est.estimatedEPS ? `Est. $${est.estimatedEPS}` : 'Est. N/A'} | ${est.actualEPS ? `Act. $${est.actualEPS}` : 'Act. pending'}
• Revenue: ${est.estimatedRevenue ? `Est. ${this.formatLargeNumber(est.estimatedRevenue)}` : 'Est. N/A'} | ${est.actualRevenue ? `Act. ${this.formatLargeNumber(est.actualRevenue)}` : 'Act. pending'}
`).join('\n')}` : 'No recent analyst estimates available'}

Consensus: ${data.analyst.analysis.consensus}` : ''}

🎯 Overall Assessment
------------------------
• Fundamental Outlook: ${data.fundamental.analysis.recommendation || 'No recommendation available'}
• Technical Signals: ${data.technical.analysis.signals?.overallSignal || 'No signals available'}
• Market Sentiment: ${data.news.analysis.overallSentiment || 'No sentiment data available'}
• Analyst Consensus: ${data.analyst.analysis.consensus || 'No consensus available'}
`;
  }

  private static formatLargeNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return 'N/A';
    
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  }
}
