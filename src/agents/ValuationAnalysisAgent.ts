
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class ValuationAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch valuation metrics
      const valuationResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/ratios/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'valuation',
        analysis: {
          valuationMetrics: this.calculateValuationMetrics(valuationResponse),
          intrinsicValue: this.estimateIntrinsicValue(valuationResponse),
          peerComparison: this.compareToPeers(valuationResponse)
        }
      };
    } catch (error) {
      console.error('Error in valuation analysis:', error);
      return {
        type: 'valuation',
        analysis: {
          valuationMetrics: {},
          intrinsicValue: 'Calculation failed',
          peerComparison: []
        }
      };
    }
  }

  private static calculateValuationMetrics(data: any): any {
    if (!Array.isArray(data) || data.length === 0) return {};
    const latest = data[0];
    
    return {
      peRatio: latest.priceEarningsRatio,
      pbRatio: latest.priceToBookRatio,
      evEbitda: latest.enterpriseValueMultiple,
      priceToSales: latest.priceToSalesRatio
    };
  }

  private static estimateIntrinsicValue(data: any): string {
    if (!Array.isArray(data) || data.length === 0) return 'Insufficient data';
    const latest = data[0];
    
    // Simple DCF calculation
    const freeCashFlow = latest.operatingCashFlowPerShare;
    const growthRate = 0.05; // Assumed 5% growth
    const discountRate = 0.1; // 10% discount rate
    const terminalValue = freeCashFlow * (1 + growthRate) / (discountRate - growthRate);
    
    return `Estimated value: $${terminalValue.toFixed(2)}`;
  }

  private static compareToPeers(data: any): string[] {
    if (!Array.isArray(data) || data.length === 0) return [];
    const latest = data[0];
    const peerComparisons = [];
    
    if (latest.priceEarningsRatio > 20) {
      peerComparisons.push('P/E ratio above industry average');
    }
    if (latest.priceToBookRatio > 3) {
      peerComparisons.push('P/B ratio indicates potential overvaluation');
    }
    
    return peerComparisons;
  }
}
