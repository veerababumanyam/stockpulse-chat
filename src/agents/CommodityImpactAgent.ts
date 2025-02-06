
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CommodityImpactAgent extends BaseAgent {
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
        type: 'commodity-impact',
        analysis: {
          relevantCommodities: this.identifyRelevantCommodities(companyProfile[0]),
          priceImpact: this.assessPriceImpact(companyProfile[0]),
          supplyChainExposure: this.evaluateSupplyChainExposure(companyProfile[0]),
          riskMitigation: this.suggestRiskMitigation(companyProfile[0])
        }
      };
    } catch (error) {
      console.error('Error in commodity impact analysis:', error);
      return {
        type: 'commodity-impact',
        analysis: {
          relevantCommodities: [],
          priceImpact: {},
          supplyChainExposure: {},
          riskMitigation: []
        }
      };
    }
  }

  private static identifyRelevantCommodities(profile: any): string[] {
    if (!profile?.sector) return [];

    const sectorCommodityMap: Record<string, string[]> = {
      'Energy': ['Oil', 'Natural Gas', 'Coal'],
      'Materials': ['Copper', 'Iron Ore', 'Aluminum'],
      'Consumer Staples': ['Wheat', 'Corn', 'Sugar'],
      'Technology': ['Semiconductors', 'Rare Earth Metals'],
      'Industrials': ['Steel', 'Aluminum', 'Copper']
    };

    return sectorCommodityMap[profile.sector] || ['No direct commodity exposure'];
  }

  private static assessPriceImpact(profile: any): any {
    if (!profile?.sector) return {};

    return {
      directImpact: this.calculateDirectImpact(profile),
      costStructure: this.analyzeCostStructure(profile),
      priceSensitivity: this.analyzePriceSensitivity(profile)
    };
  }

  private static evaluateSupplyChainExposure(profile: any): any {
    if (!profile?.sector) return {};

    return {
      criticalDependencies: this.identifyCriticalDependencies(profile),
      supplierDiversity: this.assessSupplierDiversity(profile),
      geographicRisk: this.assessGeographicRisk(profile)
    };
  }

  private static suggestRiskMitigation(profile: any): string[] {
    if (!profile?.sector) return [];

    const strategies = [
      'Implement hedging strategies',
      'Diversify supplier base',
      'Maintain strategic reserves',
      'Develop alternative sourcing',
      'Monitor commodity markets'
    ];

    if (profile.sector === 'Energy' || profile.sector === 'Materials') {
      strategies.push('Use futures contracts');
      strategies.push('Establish long-term supply agreements');
    }

    return strategies;
  }

  private static calculateDirectImpact(profile: any): string {
    const highImpactSectors = ['Energy', 'Materials', 'Industrials'];
    return highImpactSectors.includes(profile.sector) ? 'High' : 'Moderate';
  }

  private static analyzeCostStructure(profile: any): string {
    const commodityIntensiveSectors = ['Energy', 'Materials', 'Consumer Staples'];
    return commodityIntensiveSectors.includes(profile.sector) 
      ? 'Highly commodity-dependent'
      : 'Moderately commodity-dependent';
  }

  private static analyzePriceSensitivity(profile: any): string {
    const sensitiveSectors = ['Energy', 'Materials', 'Consumer Staples'];
    return sensitiveSectors.includes(profile.sector) ? 'High' : 'Moderate';
  }

  private static identifyCriticalDependencies(profile: any): string[] {
    const dependencies: Record<string, string[]> = {
      'Energy': ['Oil', 'Natural Gas'],
      'Materials': ['Raw Materials', 'Processing Chemicals'],
      'Technology': ['Rare Earth Metals', 'Semiconductors'],
      'Industrials': ['Steel', 'Energy']
    };

    return dependencies[profile.sector] || ['No critical dependencies identified'];
  }

  private static assessSupplierDiversity(profile: any): string {
    const lowDiversitySectors = ['Energy', 'Technology'];
    return lowDiversitySectors.includes(profile.sector) ? 'Limited' : 'Diverse';
  }

  private static assessGeographicRisk(profile: any): string {
    const highRiskSectors = ['Energy', 'Materials', 'Technology'];
    return highRiskSectors.includes(profile.sector) ? 'High' : 'Moderate';
  }
}
