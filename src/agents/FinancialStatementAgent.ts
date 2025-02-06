
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class FinancialStatementAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [incomeStatement, balanceSheet, cashFlow] = await Promise.all([
        this.fetchData(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=4&apikey=${fmp}`, fmp),
        this.fetchData(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=4&apikey=${fmp}`, fmp),
        this.fetchData(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=4&apikey=${fmp}`, fmp)
      ]);

      return {
        type: 'financial-statement',
        analysis: {
          income: this.analyzeIncomeStatement(incomeStatement),
          balance: this.analyzeBalanceSheet(balanceSheet),
          cashflow: this.analyzeCashFlow(cashFlow),
          keyMetrics: this.calculateKeyMetrics(incomeStatement[0], balanceSheet[0])
        }
      };
    } catch (error) {
      console.error('Error in financial statement analysis:', error);
      return {
        type: 'financial-statement',
        analysis: {
          income: {},
          balance: {},
          cashflow: {},
          keyMetrics: {}
        }
      };
    }
  }

  private static analyzeIncomeStatement(statements: any[]): any {
    if (!Array.isArray(statements) || statements.length === 0) return {};
    const latest = statements[0];
    return {
      revenue: this.formatNumber(latest.revenue),
      grossProfit: this.formatNumber(latest.grossProfit),
      operatingIncome: this.formatNumber(latest.operatingIncome),
      netIncome: this.formatNumber(latest.netIncome),
      eps: latest.eps?.toFixed(2),
      revenueGrowth: this.calculateGrowth(statements, 'revenue')
    };
  }

  private static analyzeBalanceSheet(statements: any[]): any {
    if (!Array.isArray(statements) || statements.length === 0) return {};
    const latest = statements[0];
    return {
      totalAssets: this.formatNumber(latest.totalAssets),
      totalLiabilities: this.formatNumber(latest.totalLiabilities),
      totalEquity: this.formatNumber(latest.totalStockholdersEquity),
      currentRatio: (latest.totalCurrentAssets / latest.totalCurrentLiabilities).toFixed(2),
      debtToEquity: ((latest.totalLiabilities / latest.totalStockholdersEquity) * 100).toFixed(2) + '%'
    };
  }

  private static analyzeCashFlow(statements: any[]): any {
    if (!Array.isArray(statements) || statements.length === 0) return {};
    const latest = statements[0];
    return {
      operatingCashFlow: this.formatNumber(latest.operatingCashFlow),
      investingCashFlow: this.formatNumber(latest.netCashUsedForInvestingActivites),
      financingCashFlow: this.formatNumber(latest.netCashUsedProvidedByFinancingActivities),
      freeCashFlow: this.formatNumber(latest.freeCashFlow)
    };
  }

  private static calculateKeyMetrics(income: any, balance: any): any {
    if (!income || !balance) return {};
    return {
      roa: ((income.netIncome / balance.totalAssets) * 100).toFixed(2) + '%',
      roe: ((income.netIncome / balance.totalStockholdersEquity) * 100).toFixed(2) + '%',
      profitMargin: ((income.netIncome / income.revenue) * 100).toFixed(2) + '%'
    };
  }

  private static calculateGrowth(statements: any[], metric: string): string {
    if (statements.length < 2) return 'N/A';
    const current = statements[0][metric];
    const previous = statements[1][metric];
    const growth = ((current - previous) / previous) * 100;
    return growth.toFixed(2) + '%';
  }
}
