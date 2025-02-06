
import { ResultFormatter } from './ResultFormatter';
import { SignalAnalyzer } from './SignalAnalyzer';

export class OutputFormatter {
  private static formatHighlight(text: string): string {
    return `*** ${text} ***`;
  }

  static formatOutput(data: any): string {
    const consolidatedSignal = SignalAnalyzer.getConsolidatedSignal(data);
    
    return `
📊 Analysis Report for ${data.companyName} (${data.symbol})

🎯 CONSOLIDATED RECOMMENDATION
============================
${this.formatHighlight(consolidatedSignal)}

🎯 KEY INDICATORS
============================
${this.formatHighlight(`Technical Position: ${data.results.technical?.data?.analysis.signals?.overallSignal || 'N/A'}`)}
${this.formatHighlight(`Fundamental Outlook: ${data.results.fundamental?.data?.analysis.recommendation || 'N/A'}`)}
${this.formatHighlight(`Risk Rating: ${data.results.risk?.data?.analysis.riskLevel || 'N/A'}`)}
${this.formatHighlight(`ESG Rating: ${data.results.esg?.data?.analysis.overallESGRating || 'N/A'}`)}
${this.formatHighlight(`Valuation Status: ${data.results.valuation?.data?.analysis.intrinsicValue || 'N/A'}`)}

💰 Fundamental Analysis
------------------------
${ResultFormatter.formatSection(data.results.fundamental?.data, 'Key metrics and financial health')}

📈 Technical Analysis
------------------------
${ResultFormatter.formatSection(data.results.technical?.data, 'Price action and technical indicators')}

📊 Volatility Analysis
------------------------
${ResultFormatter.formatSection(data.results.volatility?.data, 'Market volatility and trends')}

💎 Valuation Analysis
------------------------
${ResultFormatter.formatSection(data.results.valuation?.data, 'Fair value and market pricing')}

⚠️ Risk Assessment
------------------------
${ResultFormatter.formatSection(data.results.risk?.data, 'Risk factors and warnings')}

👥 Expert Analysis
------------------------
${ResultFormatter.formatSection(data.results.analyst?.data, 'Professional recommendations')}

🌱 ESG Analysis
------------------------
${ResultFormatter.formatSection(data.results.esg?.data, 'Environmental, Social, and Governance')}

🔬 Patent Analysis
------------------------
${ResultFormatter.formatSection(data.results.patentAnalysis?.data, 'Innovation and R&D')}

🐳 Big Player Tracking
------------------------
${ResultFormatter.formatSection(data.results.bigPlayerTracking?.data, 'Institutional movements')}

📰 MARKET SENTIMENT ANALYSIS
============================
${this.formatHighlight(ResultFormatter.formatSection(data.results.news?.data, 'Recent developments'))}
${this.formatHighlight(ResultFormatter.formatSection(data.results.sentiment?.data, 'Market sentiment'))}

💼 Additional Insights
------------------------
• Market Research: ${ResultFormatter.formatSection(data.results.marketResearch?.data, 'Market analysis')}
• Competition: ${ResultFormatter.formatSection(data.results.competitive?.data, 'Competitive landscape')}
• Cash Flow: ${ResultFormatter.formatSection(data.results.cashFlow?.data, 'Cash flow analysis')}
• Growth Trends: ${ResultFormatter.formatSection(data.results.growthTrends?.data, 'Growth patterns')}
• ETF Flows: ${ResultFormatter.formatSection(data.results.etfFlow?.data, 'Fund movements')}
• Legal Analysis: ${ResultFormatter.formatSection(data.results.legalDocument?.data, 'Legal considerations')}
`;
  }
}
