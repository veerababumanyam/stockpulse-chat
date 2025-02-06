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
📊 Analysis Report for ${data.companyName} (${data.symbol})

🎯 Summary & Recommendations
------------------------
• Technical Position: ${data.results.technical?.data?.analysis.signals?.overallSignal || 'N/A'}
• Fundamental Outlook: ${data.results.fundamental?.data?.analysis.recommendation || 'N/A'}
• Risk Rating: ${data.results.risk?.data?.analysis.riskLevel || 'N/A'}
• ESG Rating: ${data.results.esg?.data?.analysis.overallESGRating || 'N/A'}
• Valuation Status: ${data.results.valuation?.data?.analysis.intrinsicValue || 'N/A'}

💰 Fundamental Analysis
------------------------
${this.formatSection(data.results.fundamental?.data, 'Key metrics and financial health')}

📈 Technical Analysis
------------------------
${this.formatSection(data.results.technical?.data, 'Price action and technical indicators')}

📊 Volatility Analysis
------------------------
${this.formatSection(data.results.volatility?.data, 'Market volatility and trends')}

💎 Valuation Analysis
------------------------
${this.formatSection(data.results.valuation?.data, 'Fair value and market pricing')}

⚠️ Risk Assessment
------------------------
${this.formatSection(data.results.risk?.data, 'Risk factors and warnings')}

👥 Expert Analysis
------------------------
${this.formatSection(data.results.analyst?.data, 'Professional recommendations')}

🌱 ESG Analysis
------------------------
${this.formatSection(data.results.esg?.data, 'Environmental, Social, and Governance')}

🔬 Patent Analysis
------------------------
${this.formatSection(data.results.patentAnalysis?.data, 'Innovation and R&D')}

🐳 Big Player Tracking
------------------------
${this.formatSection(data.results.bigPlayerTracking?.data, 'Institutional movements')}

📰 News & Market Sentiment
------------------------
${this.formatSection(data.results.news?.data, 'Recent developments')}
${this.formatSection(data.results.sentiment?.data, 'Market sentiment')}

💼 Additional Insights
------------------------
• Market Research: ${this.formatSection(data.results.marketResearch?.data, 'Market analysis')}
• Competition: ${this.formatSection(data.results.competitive?.data, 'Competitive landscape')}
• Cash Flow: ${this.formatSection(data.results.cashFlow?.data, 'Cash flow analysis')}
• Growth Trends: ${this.formatSection(data.results.growthTrends?.data, 'Growth patterns')}
• ETF Flows: ${this.formatSection(data.results.etfFlow?.data, 'Fund movements')}
• Legal Analysis: ${this.formatSection(data.results.legalDocument?.data, 'Legal considerations')}
`;
  }

  private static formatSection(data: any, fallbackMessage: string): string {
    if (!data || !data.analysis) {
      return `No data available for ${fallbackMessage}`;
    }

    let output = '';
    Object.entries(data.analysis).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        output += `• ${key}:\n${this.formatArrayData(value)}\n`;
      } else if (typeof value === 'object' && value !== null) {
        output += `• ${key}:\n${this.formatObjectData(value)}\n`;
      } else if (value !== undefined && value !== null) {
        output += `• ${key}: ${value}\n`;
      }
    });

    return output || `No detailed data available for ${fallbackMessage}`;
  }

  private static formatArrayData(arr: any[]): string {
    if (!arr.length) return '  No data available';
    return arr.map(item => {
      if (typeof item === 'object') {
        return Object.entries(item)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `  - ${k}: ${v}`)
          .join('\n');
      }
      return `  - ${item}`;
    }).join('\n');
  }

  private static formatObjectData(obj: Record<string, any>): string {
    return Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `  - ${k}: ${v}`)
      .join('\n');
  }
}
