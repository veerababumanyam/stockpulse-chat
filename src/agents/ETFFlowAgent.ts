
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class ETFFlowAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const etfHoldings = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/etf-holder/${symbol}?apikey=${fmp}`,
        fmp
      );

      const etfData = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/etf-sector-weightings/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'etf-flow',
        analysis: {
          etfExposure: this.analyzeETFHoldings(etfHoldings),
          sectorAllocation: this.analyzeSectorWeightings(etfData),
          topETFs: this.getTopETFs(etfHoldings),
          flowMetrics: this.calculateFlowMetrics(etfHoldings)
        }
      };
    } catch (error) {
      console.error('Error in ETF flow analysis:', error);
      return {
        type: 'etf-flow',
        analysis: {
          etfExposure: {},
          sectorAllocation: [],
          topETFs: [],
          flowMetrics: {}
        }
      };
    }
  }

  private static analyzeETFHoldings(holdings: any[]): any {
    if (!Array.isArray(holdings)) return {};
    
    const totalShares = holdings.reduce((sum, holding) => sum + holding.shares, 0);
    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

    return {
      totalETFs: holdings.length,
      totalShares: this.formatNumber(totalShares),
      totalValue: this.formatNumber(totalValue),
      averageWeight: (holdings.reduce((sum, h) => sum + h.weight, 0) / holdings.length).toFixed(2) + '%'
    };
  }

  private static analyzeSectorWeightings(sectorData: any[]): any[] {
    if (!Array.isArray(sectorData)) return [];
    return sectorData.map(sector => ({
      sector: sector.sector,
      weight: (sector.weight * 100).toFixed(2) + '%'
    }));
  }

  private static getTopETFs(holdings: any[]): any[] {
    if (!Array.isArray(holdings)) return [];
    return holdings
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map(etf => ({
        name: etf.etfName,
        shares: this.formatNumber(etf.shares),
        value: this.formatNumber(etf.value),
        weight: etf.weight.toFixed(2) + '%'
      }));
  }

  private static calculateFlowMetrics(holdings: any[]): any {
    if (!Array.isArray(holdings)) return {};
    
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const weightedScore = holdings.reduce((sum, h) => sum + (h.value * h.weight), 0) / totalValue;

    return {
      institutionalExposure: (weightedScore * 100).toFixed(2) + '%',
      diversificationScore: Math.min(100, (holdings.length / 10) * 100).toFixed(2) + '%',
      averagePosition: this.formatNumber(totalValue / holdings.length)
    };
  }
}
