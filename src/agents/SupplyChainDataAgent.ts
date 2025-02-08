
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class SupplyChainDataAgent extends BaseAgent {
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
        type: 'supply-chain',
        analysis: {
          supplyChainMetrics: this.analyzeSupplyChain(companyProfile[0]),
          riskAssessment: this.assessSupplyChainRisks(companyProfile[0]),
          geographicalExposure: this.analyzeGeographicalExposure(companyProfile[0])
        }
      };
    } catch (error) {
      console.error('Error in supply chain analysis:', error);
      return {
        type: 'supply-chain',
        analysis: {
          supplyChainMetrics: {},
          riskAssessment: {},
          geographicalExposure: []
        }
      };
    }
  }

  private static analyzeSupplyChain(profile: any): any {
    if (!profile) return {};

    return {
      industry: profile.industry || 'Unknown',
      sector: profile.sector || 'Unknown',
      operatingRegions: this.extractRegions(profile),
      supplierDiversity: this.calculateSupplierDiversity(profile)
    };
  }

  private static assessSupplyChainRisks(profile: any): any {
    if (!profile) return {};

    return {
      geopoliticalRisk: this.calculateGeopoliticalRisk(profile),
      concentrationRisk: this.calculateConcentrationRisk(profile),
      disruptionVulnerability: this.assessDisruptionVulnerability(profile)
    };
  }

  private static analyzeGeographicalExposure(profile: any): string[] {
    if (!profile) return [];

    const regions = this.extractRegions(profile);
    return regions.map(region => `${region}: ${this.calculateRegionExposure(region)}%`);
  }

  private static extractRegions(profile: any): string[] {
    if (!profile?.country) return [];
    
    // Start with company's home country
    const regions = [profile.country];
    
    // Add major operating regions based on industry
    if (profile.industry?.includes('International')) {
      regions.push('Global');
    }
    
    return Array.from(new Set(regions));
  }

  private static calculateSupplierDiversity(profile: any): string {
    if (!profile) return 'Low';
    
    // Estimate based on company size and international presence
    if (profile.isFortune500) return 'High';
    if (profile.isInternational) return 'Medium';
    return 'Low';
  }

  private static calculateGeopoliticalRisk(profile: any): string {
    if (!profile?.country) return 'Unknown';
    
    // Simple risk assessment based on company's primary country
    const highRiskCountries = ['Unknown'];
    const mediumRiskCountries = ['International'];
    
    if (highRiskCountries.includes(profile.country)) return 'High';
    if (mediumRiskCountries.includes(profile.country)) return 'Medium';
    return 'Low';
  }

  private static calculateConcentrationRisk(profile: any): string {
    if (!profile) return 'Unknown';
    
    // Estimate based on company size and market position
    if (profile.isFortune500) return 'Low';
    if (profile.isInternational) return 'Medium';
    return 'High';
  }

  private static assessDisruptionVulnerability(profile: any): string {
    if (!profile) return 'Unknown';
    
    // Assess based on industry and size
    const vulnerableIndustries = ['Manufacturing', 'Retail', 'Technology'];
    if (vulnerableIndustries.includes(profile.industry)) return 'High';
    return 'Medium';
  }

  private static calculateRegionExposure(region: string): number {
    // Placeholder for region exposure calculation
    const exposureMap: Record<string, number> = {
      'Global': 100,
      'North America': 35,
      'Europe': 25,
      'Asia': 20,
      'Other': 20
    };
    
    return exposureMap[region] || 10;
  }
}

