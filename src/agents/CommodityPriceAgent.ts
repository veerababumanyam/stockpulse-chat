
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CommodityPriceAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const companyProfile = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${fmp}`,
        fmp
      );

      return {
        type: 'commodity-price',
        analysis: {
          relevantCommodities: this.identifyRelevantCommodities(companyProfile[0]),
          priceImpact: this.assessPriceImpact(companyProfile[0]),
          supplyDemand: this.analyzeSupplyDemand(companyProfile[0])
        }
      };
    } catch (error) {
      console.error('Error in commodity price analysis:', error);
      return {
        type: 'commodity-price',
        analysis: {
          relevantCommodities: [],
          priceImpact: {},
          supplyDemand: {}
        }
      };
    }
  }

  private static identifyRelevantCommodities(profile: any): string[] {
    if (!profile) return [];
    
    const industryCommodityMap: Record<string, string[]> = {
      'Oil & Gas': ['Crude Oil', 'Natural Gas'],
      'Mining': ['Gold', 'Silver', 'Copper'],
      'Agriculture': ['Corn', 'Wheat', 'Soybeans'],
      'Airlines': ['Jet Fuel'],
      'Steel': ['Iron Ore', 'Coal']
    };

    return industryCommodityMap[profile.industry] || [];
  }

  private static assessPriceImpact(profile: any): any {
    if (!profile) return {};

    return {
      directImpact: this.calculateDirectImpact(profile),
      indirectImpact: this.calculateIndirectImpact(profile),
      priceElasticity: this.estimatePriceElasticity(profile)
    };
  }

  private static analyzeSupplyDemand(profile: any): any {
    if (!profile) return {};

    return {
      supplyTrend: 'Stable',
      demandOutlook: 'Growing',
      marketBalance: 'Slight Deficit',
      seasonalFactors: [
        'Higher demand in winter',
        'Supply constraints in Q3'
      ]
    };
  }

  private static calculateDirectImpact(profile: any): string {
    if (!profile?.industry) return 'Unknown';
    
    const highImpactIndustries = ['Oil & Gas', 'Mining', 'Agriculture'];
    return highImpactIndustries.includes(profile.industry) ? 'High' : 'Low';
  }

  private static calculateIndirectImpact(profile: any): string {
    if (!profile?.industry) return 'Unknown';
    
    const indirectImpactIndustries = ['Transportation', 'Manufacturing'];
    return indirectImpactIndustries.includes(profile.industry) ? 'High' : 'Low';
  }

  private static estimatePriceElasticity(profile: any): string {
    if (!profile?.industry) return 'Unknown';
    
    const elasticIndustries = ['Retail', 'Consumer Discretionary'];
    return elasticIndustries.includes(profile.industry) ? 'High' : 'Low';
  }
}
