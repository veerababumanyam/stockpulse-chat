
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class RegulatoryComplianceAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/sec_filings/${symbol}?apikey=${fmp}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch regulatory data');
      }

      const data = await response.json();
      console.log('Regulatory compliance data:', data);

      return {
        type: 'regulatory-compliance',
        analysis: {
          complianceStatus: this.assessComplianceStatus(data),
          recentFilings: this.analyzeRecentFilings(data),
          riskFactors: this.identifyRiskFactors(data),
          regulatoryTrends: this.analyzeRegulatoryTrends(data)
        }
      };
    } catch (error) {
      console.error('Error in regulatory compliance analysis:', error);
      return {
        type: 'regulatory-compliance',
        analysis: {
          complianceStatus: 'Unable to assess',
          recentFilings: [],
          riskFactors: [],
          regulatoryTrends: {}
        }
      };
    }
  }

  private static assessComplianceStatus(data: any): string {
    if (!Array.isArray(data)) return 'Unknown';
    
    const recentFilings = data.slice(0, 10);
    const hasLateFilings = recentFilings.some(filing => 
      filing.type === 'NT 10-K' || filing.type === 'NT 10-Q'
    );
    
    return hasLateFilings ? 'Needs Review' : 'Compliant';
  }

  private static analyzeRecentFilings(data: any): any[] {
    if (!Array.isArray(data)) return [];
    
    return data
      .slice(0, 5)
      .map(filing => ({
        date: this.formatDate(filing.date),
        type: filing.type,
        description: filing.description,
        status: this.determineFilingStatus(filing)
      }));
  }

  private static identifyRiskFactors(data: any): string[] {
    return [
      'Regulatory compliance pending detailed analysis',
      'Further risk assessment needed'
    ];
  }

  private static analyzeRegulatoryTrends(data: any): any {
    return {
      filingCompliance: 'Analysis pending',
      disclosureQuality: 'Analysis pending',
      regulatoryChanges: 'Monitoring required'
    };
  }

  private static determineFilingStatus(filing: any): string {
    const timely = !filing.type.startsWith('NT');
    return timely ? 'Timely' : 'Late';
  }
}
