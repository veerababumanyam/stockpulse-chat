
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
• P/E Ratio: ${data.fundamental.analysis.valuationMetrics.peRatio}
• Market Cap: ${this.formatLargeNumber(data.fundamental.analysis.valuationMetrics.marketCap)}

Financial Health:
• Debt to Equity: ${data.fundamental.analysis.financialHealth.debtToEquity}
• Current Ratio: ${data.fundamental.analysis.financialHealth.currentRatio}

Recommendation: ${data.fundamental.analysis.recommendation}

📈 Technical Analysis
------------------------
Price Action:
• Current Price: $${data.technical.analysis.priceAction.currentPrice}
• 50-day MA: $${data.technical.analysis.priceAction.ma50}
• 200-day MA: $${data.technical.analysis.priceAction.ma200}

Signals:
• Trend: ${data.technical.analysis.signals.trendSignal}
• Volume: ${data.technical.analysis.signals.volumeSignal}
• Overall: ${data.technical.analysis.signals.overallSignal}

📰 Recent News Analysis
------------------------
${data.news.analysis.recentNews.map((news: any) => `
${news.date}: ${news.title}
Sentiment: ${news.sentiment}
`).join('\n')}

Overall News Sentiment: ${data.news.analysis.overallSentiment}

👥 Analyst Coverage
------------------------
Recent Recommendations:
${data.analyst.analysis.recommendations.map((rec: any) => `
${rec.date}: ${rec.company}
• Recommendation: ${rec.recommendation}
• Target Price: $${rec.targetPrice}
`).join('\n')}

Recent Estimates:
${data.analyst.analysis.estimates.map((est: any) => `
${est.date}:
• EPS: Est. $${est.estimatedEPS} | Act. $${est.actualEPS || 'N/A'}
• Revenue: Est. ${this.formatLargeNumber(est.estimatedRevenue)} | Act. ${est.actualRevenue ? this.formatLargeNumber(est.actualRevenue) : 'N/A'}
`).join('\n')}

Consensus: ${data.analyst.analysis.consensus}

🎯 Overall Assessment
------------------------
• Fundamental Outlook: ${data.fundamental.analysis.recommendation}
• Technical Signals: ${data.technical.analysis.signals.overallSignal}
• Market Sentiment: ${data.news.analysis.overallSentiment}
• Analyst Consensus: ${data.analyst.analysis.consensus}
`;
  }

  private static formatLargeNumber(num: number): string {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  }
}
