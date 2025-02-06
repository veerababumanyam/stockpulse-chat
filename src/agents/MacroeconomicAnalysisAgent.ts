
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class MacroeconomicAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch sector performance data
      const sectorResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/stock/sectors-performance?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'macroeconomic',
        analysis: {
          sectorPerformance: {
            daily: sectorResponse.sectorPerformance || [],
            description: 'Sector performance analysis showing relative strength'
          },
          marketConditions: {
            overallMarket: this.assessMarketConditions(sectorResponse),
            sectorOutlook: this.getSectorOutlook(sectorResponse)
          }
        }
      };
    } catch (error) {
      console.error('Error in macroeconomic analysis:', error);
      return {
        type: 'macroeconomic',
        analysis: {
          sectorPerformance: [],
          marketConditions: {
            overallMarket: 'Data unavailable',
            sectorOutlook: 'Unable to determine sector outlook'
          }
        }
      };
    }
  }

  private static assessMarketConditions(sectorData: any): string {
    if (!sectorData || !sectorData.sectorPerformance) {
      return 'Market conditions data unavailable';
    }

    const sectors = sectorData.sectorPerformance;
    const positiveCount = sectors.filter((s: any) => parseFloat(s.changesPercentage) > 0).length;
    
    if (positiveCount > sectors.length * 0.7) return 'Strong Bullish Market';
    if (positiveCount > sectors.length * 0.5) return 'Moderately Bullish';
    if (positiveCount < sectors.length * 0.3) return 'Bearish Market';
    return 'Mixed Market Conditions';
  }

  private static getSectorOutlook(sectorData: any): string {
    if (!sectorData || !sectorData.sectorPerformance) {
      return 'Sector outlook data unavailable';
    }

    const sectors = sectorData.sectorPerformance;
    const bestSector = sectors.reduce((prev: any, current: any) => {
      return parseFloat(prev.changesPercentage) > parseFloat(current.changesPercentage) ? prev : current;
    });

    return `Leading sector: ${bestSector.sector} (${bestSector.changesPercentage}%)`;
  }
}
