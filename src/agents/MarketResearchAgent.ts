
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class MarketResearchAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch market research data
      const researchResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/market-analysis/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'market-research',
        analysis: {
          sectorTrends: this.analyzeSectorTrends(researchResponse),
          marketPosition: this.assessMarketPosition(researchResponse),
          researchHighlights: this.extractHighlights(researchResponse)
        }
      };
    } catch (error) {
      console.error('Error in market research:', error);
      return {
        type: 'market-research',
        analysis: {
          sectorTrends: [],
          marketPosition: 'Data unavailable',
          researchHighlights: []
        }
      };
    }
  }

  private static analyzeSectorTrends(data: any): string[] {
    if (!data || !data.sectorAnalysis) return [];
    return data.sectorAnalysis.map((trend: any) => trend.description);
  }

  private static assessMarketPosition(data: any): string {
    if (!data || !data.marketPosition) return 'Market position data unavailable';
    return data.marketPosition.summary;
  }

  private static extractHighlights(data: any): string[] {
    if (!data || !data.highlights) return [];
    return data.highlights.map((highlight: any) => highlight.point);
  }
}
