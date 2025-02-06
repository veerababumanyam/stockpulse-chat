
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class BigPlayerTrackingAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [institutionalHolders, mutualFundHolders] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/institutional-holder/${symbol}?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/mutual-fund-holder/${symbol}?apikey=${fmp}`,
          fmp
        )
      ]);

      return {
        type: 'big-player-tracking',
        analysis: {
          institutionalMetrics: this.analyzeInstitutionalHoldings(institutionalHolders),
          mutualFundMetrics: this.analyzeMutualFundHoldings(mutualFundHolders),
          topHolders: this.getTopHolders(institutionalHolders, mutualFundHolders),
          holdingPatterns: this.analyzeHoldingPatterns(institutionalHolders, mutualFundHolders)
        }
      };
    } catch (error) {
      console.error('Error in big player tracking:', error);
      return {
        type: 'big-player-tracking',
        analysis: {
          institutionalMetrics: {},
          mutualFundMetrics: {},
          topHolders: [],
          holdingPatterns: {}
        }
      };
    }
  }

  private static analyzeInstitutionalHoldings(holders: any[]): any {
    if (!Array.isArray(holders)) return {};
    
    const totalShares = holders.reduce((sum, holder) => sum + Number(holder.sharesHeld), 0);
    const totalValue = holders.reduce((sum, holder) => sum + (Number(holder.sharesHeld) * Number(holder.value)), 0);

    return {
      totalInstitutions: holders.length,
      totalShares: this.formatNumber(totalShares),
      totalValue: this.formatNumber(totalValue),
      averageHolding: this.formatNumber(totalShares / holders.length)
    };
  }

  private static analyzeMutualFundHoldings(holders: any[]): any {
    if (!Array.isArray(holders)) return {};
    
    const totalShares = holders.reduce((sum, holder) => sum + Number(holder.sharesHeld), 0);
    const totalValue = holders.reduce((sum, holder) => sum + (Number(holder.sharesHeld) * Number(holder.value)), 0);

    return {
      totalFunds: holders.length,
      totalShares: this.formatNumber(totalShares),
      totalValue: this.formatNumber(totalValue),
      averageHolding: this.formatNumber(totalShares / holders.length)
    };
  }

  private static getTopHolders(institutional: any[], mutualFund: any[]): any[] {
    const allHolders = [
      ...institutional.map(h => ({ ...h, type: 'Institution' })),
      ...mutualFund.map(h => ({ ...h, type: 'Mutual Fund' }))
    ];

    return allHolders
      .sort((a, b) => (Number(b.sharesHeld) * Number(b.value)) - (Number(a.sharesHeld) * Number(a.value)))
      .slice(0, 10)
      .map(holder => ({
        name: holder.holder,
        type: holder.type,
        shares: this.formatNumber(Number(holder.sharesHeld)),
        value: this.formatNumber(Number(holder.sharesHeld) * Number(holder.value)),
        dateReported: this.formatDate(holder.dateReported)
      }));
  }

  private static analyzeHoldingPatterns(institutional: any[], mutualFund: any[]): any {
    const patterns = {
      institutionalConcentration: '0%',
      mutualFundDiversification: 'Unknown',
      holdingStability: 'Unknown'
    };

    if (Array.isArray(institutional) && institutional.length > 0) {
      const totalInstitutionalShares = institutional.reduce((sum, h) => sum + Number(h.sharesHeld), 0);
      const topHolderShares = Number(institutional[0]?.sharesHeld || 0);
      patterns.institutionalConcentration = ((topHolderShares / totalInstitutionalShares) * 100).toFixed(2) + '%';
    }

    if (Array.isArray(mutualFund) && mutualFund.length > 0) {
      patterns.mutualFundDiversification = mutualFund.length > 100 ? 'High' : mutualFund.length > 50 ? 'Medium' : 'Low';
    }

    return patterns;
  }
}
