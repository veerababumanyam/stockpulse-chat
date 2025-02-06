
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

      console.log('Cash flow data:', cashFlowResponse);

      return {
        type: 'cash-flow',
        analysis: {
          summary: {
            recommendation: this.generateRecommendation(cashFlowResponse),
          },
          signals: {
            overallSignal: this.assessCashFlowStrength(cashFlowResponse)
          },
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
          summary: {
            recommendation: 'HOLD'
          },
          signals: {
            overallSignal: 'HOLD'
          },
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
    if (!Array.isArray(data) || data.length < 2) return 'HOLD';
    const [current, previous] = data;
    const growth = ((current.operatingCashFlow - previous.operatingCashFlow) / Math.abs(previous.operatingCashFlow)) * 100;
    
    if (growth > 20) return 'BUY';
    if (growth > 0) return 'HOLD';
    return 'SELL';
  }

  private static evaluateSustainability(data: any[]): string {
    if (!Array.isArray(data) || !data.length) return 'Cannot evaluate sustainability';
    const latestData = data[0];
    const freeCashFlow = latestData.operatingCashFlow - latestData.capitalExpenditure;
    return freeCashFlow > 0 ? 'Sustainable' : 'Unsustainable';
  }

  private static generateRecommendation(data: any[]): string {
    if (!Array.isArray(data) || data.length < 2) return 'HOLD';
    const [current, previous] = data;
    const growth = ((current.operatingCashFlow - previous.operatingCashFlow) / Math.abs(previous.operatingCashFlow)) * 100;
    
    if (growth > 20 && current.operatingCashFlow > 0) return 'BUY';
    if (growth < -20 || current.operatingCashFlow < 0) return 'SELL';
    return 'HOLD';
  }
}

