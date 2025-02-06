
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
    return `
📊 Analysis Report for ${data.companyName} (${data.symbol})

🔎 Fundamental Analysis
------------------------
Valuation Metrics:
• P/E Ratio: ${data.fundamental.analysis.valuationMetrics?.peRatio || 'N/A'}
• Market Cap: ${data.fundamental.analysis.valuationMetrics?.marketCap ? this.formatLargeNumber(data.fundamental.analysis.valuationMetrics.marketCap) : 'N/A'}

Financial Health:
• Debt to Equity: ${data.fundamental.analysis.financialHealth?.debtToEquity || 'N/A'}
• Current Ratio: ${data.fundamental.analysis.financialHealth?.currentRatio || 'N/A'}

Recommendation: ${data.fundamental.analysis.recommendation || 'N/A'}

📈 Technical Analysis
------------------------
Price Action:
• Current Price: $${data.technical.analysis.priceAction?.currentPrice || 'N/A'}
• 50-day MA: $${data.technical.analysis.priceAction?.ma50 || 'N/A'}
• 200-day MA: $${data.technical.analysis.priceAction?.ma200 || 'N/A'}

Signals:
• Trend: ${data.technical.analysis.signals?.trendSignal || 'N/A'}
• Volume: ${data.technical.analysis.signals?.volumeSignal || 'N/A'}
• Overall: ${data.technical.analysis.signals?.overallSignal || 'N/A'}

📰 Recent News Analysis
------------------------
${(data.news.analysis.recentNews || []).map((news: any) => `
${news.date || 'N/A'}: ${news.title || 'N/A'}
Sentiment: ${news.sentiment || 'N/A'}
`).join('\n')}

Overall News Sentiment: ${data.news.analysis.overallSentiment || 'N/A'}

👥 Analyst Coverage
------------------------
Recent Recommendations:
${(data.analyst.analysis.recommendations || []).map((rec: any) => `
${rec.date || 'N/A'}: ${rec.company || 'N/A'}
• Recommendation: ${rec.recommendation || 'N/A'}
• Target Price: ${rec.targetPrice ? `$${rec.targetPrice}` : 'N/A'}
`).join('\n')}

Recent Estimates:
${(data.analyst.analysis.estimates || []).map((est: any) => `
${est.date || 'N/A'}:
• EPS: Est. ${est.estimatedEPS ? `$${est.estimatedEPS}` : 'N/A'} | Act. ${est.actualEPS ? `$${est.actualEPS}` : 'N/A'}
• Revenue: Est. ${est.estimatedRevenue ? this.formatLargeNumber(est.estimatedRevenue) : 'N/A'} | Act. ${est.actualRevenue ? this.formatLargeNumber(est.actualRevenue) : 'N/A'}
`).join('\n')}

Consensus: ${data.analyst.analysis.consensus || 'N/A'}

🎯 Overall Assessment
------------------------
• Fundamental Outlook: ${data.fundamental.analysis.recommendation || 'N/A'}
• Technical Signals: ${data.technical.analysis.signals?.overallSignal || 'N/A'}
• Market Sentiment: ${data.news.analysis.overallSentiment || 'N/A'}
• Analyst Consensus: ${data.analyst.analysis.consensus || 'N/A'}
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
