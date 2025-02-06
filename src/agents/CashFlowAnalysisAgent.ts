
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CashFlowAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const cashFlowResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'cash-flow',
        analysis: {
          operatingCashFlow: this.analyzeCashFlow(cashFlowResponse),
          cashFlowStrength: this.assessCashFlowStrength(cashFlowResponse),
          sustainability: this.evaluateSustainability(cashFlowResponse)
        }
      };
    } catch (error) {
      console.error('Error in cash flow analysis:', error);
      return {
        type: 'cash-flow',
        analysis: {
          operatingCashFlow: 'Data unavailable',
          cashFlowStrength: 'Unable to assess',
          sustainability: 'Cannot evaluate'
        }
      };
    }
  }

  private static analyzeCashFlow(data: any[]): string {
    if (!Array.isArray(data) || !data.length) return 'No cash flow data available';
    const latestCashFlow = data[0];
    return `Operating Cash Flow: ${this.formatNumber(latestCashFlow.operatingCashFlow)}`;
  }

  private static assessCashFlowStrength(data: any[]): string {
    if (!Array.isArray(data) || data.length < 2) return 'Insufficient data';
    const [current, previous] = data;
    const growth = ((current.operatingCashFlow - previous.operatingCashFlow) / Math.abs(previous.operatingCashFlow)) * 100;
    
    if (growth > 20) return 'Strong';
    if (growth > 0) return 'Stable';
    return 'Weak';
  }

  private static evaluateSustainability(data: any[]): string {
    if (!Array.isArray(data) || !data.length) return 'Cannot evaluate sustainability';
    const latestData = data[0];
    const freeCashFlow = latestData.operatingCashFlow - latestData.capitalExpenditure;
    return freeCashFlow > 0 ? 'Sustainable' : 'Unsustainable';
  }
}
