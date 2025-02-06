
import { FundamentalAnalysisAgent } from './FundamentalAnalysisAgent';
import { TechnicalAnalysisAgent } from './TechnicalAnalysisAgent';
import { NewsAnalysisAgent } from './NewsAnalysisAgent';
import { AnalystRecommendationsAgent } from './AnalystRecommendationsAgent';
import { MarketSentimentAgent } from './MarketSentimentAgent';
import { RiskAssessmentAgent } from './RiskAssessmentAgent';
import { MacroeconomicAnalysisAgent } from './MacroeconomicAnalysisAgent';
import { DataCleansingAgent } from './DataCleansingAgent';
import { CompetitiveAnalysisAgent } from './CompetitiveAnalysisAgent';
import { ESGAnalysisAgent } from './ESGAnalysisAgent';

export class OrchestratorAgent {
  static async orchestrateAnalysis(stockData: any) {
    try {
      // Run all analyses in parallel
      const [
        fundamentalAnalysis,
        technicalAnalysis,
        newsAnalysis,
        analystAnalysis,
        marketSentiment,
        riskAssessment,
        macroAnalysis,
        dataQuality,
        competitiveAnalysis,
        esgAnalysis
      ] = await Promise.all([
        FundamentalAnalysisAgent.analyze(stockData),
        TechnicalAnalysisAgent.analyze(stockData),
        NewsAnalysisAgent.analyze(stockData.quote.symbol),
        AnalystRecommendationsAgent.analyze(stockData.quote.symbol),
        MarketSentimentAgent.analyze(stockData.quote.symbol),
        RiskAssessmentAgent.analyze(stockData),
        MacroeconomicAnalysisAgent.analyze(stockData.quote.symbol),
        DataCleansingAgent.analyze(stockData),
        CompetitiveAnalysisAgent.analyze(stockData.quote.symbol),
        ESGAnalysisAgent.analyze(stockData.quote.symbol)
      ]);

      return this.formatOutput({
        symbol: stockData.quote.symbol,
        companyName: stockData.profile.companyName,
        fundamental: fundamentalAnalysis,
        technical: technicalAnalysis,
        news: newsAnalysis,
        analyst: analystAnalysis,
        sentiment: marketSentiment,
        risk: riskAssessment,
        macro: macroAnalysis,
        dataQuality: dataQuality,
        competitive: competitiveAnalysis,
        esg: esgAnalysis
      });
    } catch (error) {
      console.error('Error in orchestration:', error);
      throw new Error('Error analyzing stock data. Please try again.');
    }
  }

  private static formatOutput(data: any): string {
    return `
📊 Comprehensive Analysis Report for ${data.companyName} (${data.symbol})

🔎 Fundamental Analysis
------------------------
${this.formatSection(data.fundamental, 'Fundamental metrics and company health')}

📈 Technical Analysis
------------------------
${this.formatSection(data.technical, 'Technical indicators and price action')}

🏢 Competitive Analysis
------------------------
${this.formatSection(data.competitive, 'Competitive position and peer comparison')}

📰 News & Sentiment Analysis
------------------------
${this.formatSection(data.news, 'Recent news and market sentiment')}
${this.formatSection(data.sentiment, 'Overall market sentiment')}

👥 Expert Analysis
------------------------
${this.formatSection(data.analyst, 'Analyst recommendations and forecasts')}

⚠️ Risk Assessment
------------------------
${this.formatSection(data.risk, 'Risk metrics and warnings')}

🌐 Macroeconomic Context
------------------------
${this.formatSection(data.macro, 'Macroeconomic factors and impact')}

🌱 ESG Analysis
------------------------
${this.formatSection(data.esg, 'Environmental, Social, and Governance metrics')}

📊 Data Quality
------------------------
${this.formatSection(data.dataQuality, 'Data quality assessment')}

🎯 Summary & Recommendations
------------------------
• Technical Outlook: ${data.technical.analysis.signals?.overallSignal || 'N/A'}
• Fundamental Position: ${data.fundamental.analysis.recommendation || 'N/A'}
• Risk Level: ${data.risk.analysis.riskLevel || 'N/A'}
• Market Sentiment: ${data.sentiment.analysis.overallSentiment || 'N/A'}
• ESG Rating: ${data.esg.analysis.overallESGRating || 'N/A'}
`;
  }

  private static formatSection(data: any, fallbackMessage: string): string {
    if (!data || !data.analysis) {
      return `Data not available for ${fallbackMessage}`;
    }

    let output = '';
    Object.entries(data.analysis).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        output += `${this.formatArrayData(value, key)}\n`;
      } else if (typeof value === 'object' && value !== null) {
        output += `${this.formatObjectData(value, key)}\n`;
      } else if (value !== undefined && value !== null) {
        output += `• ${key}: ${value}\n`;
      }
    });

    return output || `No data available for ${fallbackMessage}`;
  }

  private static formatArrayData(arr: any[], key: string): string {
    if (!arr.length) return '';
    return arr.map(item => {
      if (typeof item === 'object') {
        return Object.entries(item)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join('\n');
      }
      return `• ${item}`;
    }).join('\n');
  }

  private static formatObjectData(obj: Record<string, any>, key: string): string {
    return Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join('\n');
  }

  private static formatLargeNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return 'N/A';
    
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  }
}
