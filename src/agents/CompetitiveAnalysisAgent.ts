
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CompetitiveAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch peer companies data
      const peersResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v4/stock_peers?symbol=${symbol}&apikey=${fmp}`,
        fmp
      );

      return {
        type: 'competitive',
        analysis: {
          peerComparison: this.analyzePeers(peersResponse),
          marketPosition: this.assessMarketPosition(peersResponse),
          competitiveAdvantages: this.identifyAdvantages(peersResponse)
        }
      };
    } catch (error) {
      console.error('Error in competitive analysis:', error);
      return {
        type: 'competitive',
        analysis: {
          peerComparison: [],
          marketPosition: 'Unable to determine market position',
          competitiveAdvantages: []
        }
      };
    }
  }

  private static analyzePeers(peersData: any): any[] {
    if (!peersData || !Array.isArray(peersData)) return [];
    
    return peersData.map((peer: any) => ({
      symbol: peer.symbol || 'N/A',
      name: peer.name || 'N/A',
      marketCap: peer.marketCap || 'N/A'
    }));
  }

  private static assessMarketPosition(peersData: any): string {
    if (!peersData || !Array.isArray(peersData)) {
      return 'Market position data unavailable';
    }

    const peerCount = peersData.length;
    if (peerCount === 0) return 'No peer comparison available';
    if (peerCount <= 3) return 'Limited competition in market';
    return 'Competitive market with multiple players';
  }

  private static identifyAdvantages(peersData: any): string[] {
    if (!peersData || !Array.isArray(peersData)) return [];
    
    const advantages: string[] = [];
    
    if (peersData.length > 0) {
      advantages.push('Established market presence');
      if (peersData.length < 5) {
        advantages.push('Limited competition in sector');
      }
    }
    
    return advantages;
  }
}
