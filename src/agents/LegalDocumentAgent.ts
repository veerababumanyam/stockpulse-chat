
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class LegalDocumentAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const filings = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/sec_filings/${symbol}?limit=20&apikey=${fmp}`,
        fmp
      );

      return {
        type: 'legal-document',
        analysis: {
          recentFilings: this.processFilings(filings),
          filingMetrics: this.calculateFilingMetrics(filings),
          significantEvents: this.identifySignificantEvents(filings)
        }
      };
    } catch (error) {
      console.error('Error in legal document analysis:', error);
      return {
        type: 'legal-document',
        analysis: {
          recentFilings: [],
          filingMetrics: {},
          significantEvents: []
        }
      };
    }
  }

  private static processFilings(filings: any[]): any[] {
    if (!Array.isArray(filings)) return [];
    return filings.map(filing => ({
      type: filing.type,
      date: this.formatDate(filing.fillingDate),
      title: filing.title,
      link: filing.finalLink
    }));
  }

  private static calculateFilingMetrics(filings: any[]): any {
    if (!Array.isArray(filings)) return {};
    
    const types = filings.reduce((acc: Record<string, number>, filing) => {
      acc[filing.type] = (acc[filing.type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalFilings: filings.length,
      filingTypes: types,
      mostRecentDate: filings[0] ? this.formatDate(filings[0].fillingDate) : 'N/A'
    };
  }

  private static identifySignificantEvents(filings: any[]): string[] {
    if (!Array.isArray(filings)) return [];
    
    const significantTypes = ['8-K', '10-K', '10-Q'];
    return filings
      .filter(filing => significantTypes.includes(filing.type))
      .map(filing => `${filing.type} filed on ${this.formatDate(filing.fillingDate)}: ${filing.title}`);
  }
}
