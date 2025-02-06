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
import { TechnicalDataAgent } from './TechnicalDataAgent';
import { MarketResearchAgent } from './MarketResearchAgent';
import { DataIntegrationAgent } from './DataIntegrationAgent';
import { ValuationAnalysisAgent } from './ValuationAnalysisAgent';
import { CashFlowAnalysisAgent } from './CashFlowAnalysisAgent';
import { VolatilityAnalysisAgent } from './VolatilityAnalysisAgent';
import { GrowthTrendAnalysisAgent } from './GrowthTrendAnalysisAgent';
import { DividendAnalysisAgent } from './DividendAnalysisAgent';
import { NewsScraperAgent } from './NewsScraperAgent';
import { FinancialStatementAgent } from './FinancialStatementAgent';
import { ETFFlowAgent } from './ETFFlowAgent';
// New imports
import { LegalDocumentAgent } from './LegalDocumentAgent';
import { PatentAnalysisAgent } from './PatentAnalysisAgent';
import { BigPlayerTrackingAgent } from './BigPlayerTrackingAgent';
import { SocialMediaScraperAgent } from './SocialMediaScraperAgent';

export class OrchestratorAgent {
  static async orchestrateAnalysis(stockData: any) {
    try {
      // Run all analyses in parallel
      const [
        fundamental,
        technical,
        news,
        analyst,
        marketSentiment,
        risk,
        macro,
        dataQuality,
        competitive,
        esg,
        technicalData,
        marketResearch,
        dataIntegration,
        valuation,
        cashFlow,
        volatility,
        growthTrends,
        dividend,
        newsScraper,
        financialStatement,
        etfFlow,
        // New analyses
        legalDocument,
        patentAnalysis,
        bigPlayerTracking,
        socialMediaScraper
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
        ESGAnalysisAgent.analyze(stockData.quote.symbol),
        TechnicalDataAgent.analyze(stockData.quote.symbol),
        MarketResearchAgent.analyze(stockData.quote.symbol),
        DataIntegrationAgent.analyze(stockData),
        ValuationAnalysisAgent.analyze(stockData.quote.symbol),
        CashFlowAnalysisAgent.analyze(stockData.quote.symbol),
        VolatilityAnalysisAgent.analyze(stockData.quote.symbol),
        GrowthTrendAnalysisAgent.analyze(stockData.quote.symbol),
        DividendAnalysisAgent.analyze(stockData.quote.symbol),
        NewsScraperAgent.analyze(stockData.quote.symbol),
        FinancialStatementAgent.analyze(stockData.quote.symbol),
        ETFFlowAgent.analyze(stockData.quote.symbol),
        // New agent calls
        LegalDocumentAgent.analyze(stockData.quote.symbol),
        PatentAnalysisAgent.analyze(stockData.quote.symbol),
        BigPlayerTrackingAgent.analyze(stockData.quote.symbol),
        SocialMediaScraperAgent.analyze(stockData.quote.symbol)
      ]);

      return this.formatOutput({
        symbol: stockData.quote.symbol,
        companyName: stockData.profile.companyName,
        fundamental,
        technical,
        news,
        analyst,
        sentiment: marketSentiment,
        risk,
        macro,
        dataQuality,
        competitive,
        esg,
        technicalData,
        marketResearch,
        dataIntegration,
        valuation,
        cashFlow,
        volatility,
        growthTrends,
        dividend,
        newsScraper,
        financialStatement,
        etfFlow,
        // New analysis results
        legalDocument,
        patentAnalysis,
        bigPlayerTracking,
        socialMediaScraper
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
${this.formatSection(data.technicalData, 'Detailed technical data')}

💰 Cash Flow Analysis
------------------------
${this.formatSection(data.cashFlow, 'Cash flow metrics and sustainability')}

📊 Volatility Analysis
------------------------
${this.formatSection(data.volatility, 'Volatility metrics and risk assessment')}

🏢 Market Research & Competition
------------------------
${this.formatSection(data.marketResearch, 'Market research and sector analysis')}
${this.formatSection(data.competitive, 'Competitive position and peer comparison')}

💰 Valuation Analysis
------------------------
${this.formatSection(data.valuation, 'Valuation metrics and intrinsic value')}

📰 News & Sentiment Analysis
------------------------
${this.formatSection(data.news, 'Recent news and market sentiment')}
${this.formatSection(data.sentiment, 'Overall market sentiment')}
${this.formatSection(data.newsScraper, 'Scraped news and sentiment')}

🏦 Financial Health
------------------------
${this.formatSection(data.financialStatement, 'Financial statement analysis')}

💸 ETF Flow Analysis
------------------------
${this.formatSection(data.etfFlow, 'ETF flow and holdings analysis')}

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

📊 Data Quality & Integration
------------------------
${this.formatSection(data.dataQuality, 'Data quality assessment')}
${this.formatSection(data.dataIntegration, 'Integrated data analysis')}

🏛️ Legal Document Analysis
------------------------
${this.formatSection(data.legalDocument, 'Analysis of legal filings and documents')}

🧪 Patent Analysis
------------------------
${this.formatSection(data.patentAnalysis, 'Analysis of company patents and innovation')}

🐳 Big Player Tracking
------------------------
${this.formatSection(data.bigPlayerTracking, 'Tracking of institutional and big player holdings')}

📱 Social Media Scraping
------------------------
${this.formatSection(data.socialMediaScraper, 'Scraped social media data and sentiment')}

🎯 Summary & Recommendations
------------------------
• Technical Outlook: ${data.technical.analysis.signals?.overallSignal || 'N/A'}
• Fundamental Position: ${data.fundamental.analysis.recommendation || 'N/A'}
• Risk Level: ${data.risk.analysis.riskLevel || 'N/A'}
• Market Sentiment: ${data.sentiment.analysis.overallSentiment || 'N/A'}
• ESG Rating: ${data.esg.analysis.overallESGRating || 'N/A'}
• Valuation Status: ${data.valuation.analysis.intrinsicValue || 'N/A'}
• Cash Flow Health: ${data.cashFlow.analysis.cashFlowStrength || 'N/A'}
• Volatility Status: ${data.volatility.analysis.volatilityTrend || 'N/A'}
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
