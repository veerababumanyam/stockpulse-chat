
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
import { LegalDocumentAgent } from './LegalDocumentAgent';
import { PatentAnalysisAgent } from './PatentAnalysisAgent';
import { BigPlayerTrackingAgent } from './BigPlayerTrackingAgent';
// Temporarily commented out SocialMediaScraperAgent
// import { SocialMediaScraperAgent } from './SocialMediaScraperAgent';

interface AgentResult {
  data: any;
  error?: string;
}

type AgentResults = Map<string, AgentResult>;

export class OrchestratorAgent {
  private static results: AgentResults = new Map();

  static async orchestrateAnalysis(stockData: any) {
    this.results.clear();

    try {
      const agentPromises = [
        this.executeAgent('fundamental', () => FundamentalAnalysisAgent.analyze(stockData)),
        this.executeAgent('technical', () => TechnicalAnalysisAgent.analyze(stockData)),
        this.executeAgent('news', () => NewsAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('analyst', () => AnalystRecommendationsAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('sentiment', () => MarketSentimentAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('risk', () => RiskAssessmentAgent.analyze(stockData)),
        this.executeAgent('macro', () => MacroeconomicAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('dataQuality', () => DataCleansingAgent.analyze(stockData)),
        this.executeAgent('competitive', () => CompetitiveAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('esg', () => ESGAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('technicalData', () => TechnicalDataAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('marketResearch', () => MarketResearchAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('dataIntegration', () => DataIntegrationAgent.analyze(stockData)),
        this.executeAgent('valuation', () => ValuationAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('cashFlow', () => CashFlowAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('volatility', () => VolatilityAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('growthTrends', () => GrowthTrendAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('dividend', () => DividendAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('newsScraper', () => NewsScraperAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('financialStatement', () => FinancialStatementAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('etfFlow', () => ETFFlowAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('legalDocument', () => LegalDocumentAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('patentAnalysis', () => PatentAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('bigPlayerTracking', () => BigPlayerTrackingAgent.analyze(stockData.quote.symbol)),
        // Temporarily disabled SocialMediaScraperAgent
        // this.executeAgent('socialMedia', () => SocialMediaScraperAgent.analyze(stockData.quote.symbol))
      ];

      await Promise.all(agentPromises);

      return this.formatOutput({
        symbol: stockData.quote.symbol,
        companyName: stockData.profile.companyName,
        results: Object.fromEntries(this.results)
      });
    } catch (error) {
      console.error('Error in orchestration:', error);
      throw new Error('Error analyzing stock data. Please try again.');
    }
  }

  private static async executeAgent(name: string, agentFn: () => Promise<any>): Promise<void> {
    try {
      const result = await agentFn();
      this.results.set(name, { data: result });
    } catch (error) {
      console.error(`Error in ${name} agent:`, error);
      this.results.set(name, { 
        data: null, 
        error: `${name} analysis failed: ${error.message}` 
      });
    }
  }

  private static formatOutput(data: any): string {
    return `
📊 Comprehensive Analysis Report for ${data.companyName} (${data.symbol})

🔎 Fundamental Analysis
------------------------
${this.formatSection(data.results.fundamental?.data, 'Fundamental metrics and company health')}

📈 Technical Analysis
------------------------
${this.formatSection(data.results.technical?.data, 'Technical indicators and price action')}
${this.formatSection(data.results.technicalData?.data, 'Detailed technical data')}

💰 Cash Flow Analysis
------------------------
${this.formatSection(data.results.cashFlow?.data, 'Cash flow metrics and sustainability')}

📊 Volatility Analysis
------------------------
${this.formatSection(data.results.volatility?.data, 'Volatility metrics and risk assessment')}

🏢 Market Research & Competition
------------------------
${this.formatSection(data.results.marketResearch?.data, 'Market research and sector analysis')}
${this.formatSection(data.results.competitive?.data, 'Competitive position and peer comparison')}

💰 Valuation Analysis
------------------------
${this.formatSection(data.results.valuation?.data, 'Valuation metrics and intrinsic value')}

📰 News & Sentiment Analysis
------------------------
${this.formatSection(data.results.news?.data, 'Recent news and market sentiment')}
${this.formatSection(data.results.sentiment?.data, 'Overall market sentiment')}
${this.formatSection(data.results.newsScraper?.data, 'Scraped news and sentiment')}

🏦 Financial Health
------------------------
${this.formatSection(data.results.financialStatement?.data, 'Financial statement analysis')}

💸 ETF Flow Analysis
------------------------
${this.formatSection(data.results.etfFlow?.data, 'ETF flow and holdings analysis')}

👥 Expert Analysis
------------------------
${this.formatSection(data.results.analyst?.data, 'Analyst recommendations and forecasts')}

⚠️ Risk Assessment
------------------------
${this.formatSection(data.results.risk?.data, 'Risk metrics and warnings')}

🌐 Macroeconomic Context
------------------------
${this.formatSection(data.results.macro?.data, 'Macroeconomic factors and impact')}

🌱 ESG Analysis
------------------------
${this.formatSection(data.results.esg?.data, 'Environmental, Social, and Governance metrics')}

📊 Data Quality & Integration
------------------------
${this.formatSection(data.results.dataQuality?.data, 'Data quality assessment')}
${this.formatSection(data.results.dataIntegration?.data, 'Integrated data analysis')}

🏛️ Legal Document Analysis
------------------------
${this.formatSection(data.results.legalDocument?.data, 'Analysis of legal filings and documents')}

🧪 Patent Analysis
------------------------
${this.formatSection(data.results.patentAnalysis?.data, 'Analysis of company patents and innovation')}

🐳 Big Player Tracking
------------------------
${this.formatSection(data.results.bigPlayerTracking?.data, 'Tracking of institutional and big player holdings')}

📱 Social Media Scraping
------------------------
${this.formatSection(data.results.socialMedia?.data, 'Scraped social media data and sentiment')}

🎯 Summary & Recommendations
------------------------
• Technical Outlook: ${data.results.technical?.data?.analysis.signals?.overallSignal || 'N/A'}
• Fundamental Position: ${data.results.fundamental?.data?.analysis.recommendation || 'N/A'}
• Risk Level: ${data.results.risk?.data?.analysis.riskLevel || 'N/A'}
• Market Sentiment: ${data.results.sentiment?.data?.analysis.overallSentiment || 'N/A'}
• ESG Rating: ${data.results.esg?.data?.analysis.overallESGRating || 'N/A'}
• Valuation Status: ${data.results.valuation?.data?.analysis.intrinsicValue || 'N/A'}
• Cash Flow Health: ${data.results.cashFlow?.data?.analysis.cashFlowStrength || 'N/A'}
• Volatility Status: ${data.results.volatility?.data?.analysis.volatilityTrend || 'N/A'}
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
}
