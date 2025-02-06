
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class PatentAnalysisAgent extends BaseAgent {
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

      // Since we don't have direct patent API access, we'll use company profile data
      // to make informed analysis about their R&D and innovation
      const analysis = this.analyzeInnovationMetrics(companyProfile[0]);

      return {
        type: 'patent-analysis',
        analysis
      };
    } catch (error) {
      console.error('Error in patent analysis:', error);
      return {
        type: 'patent-analysis',
        analysis: {
          innovationScore: 0,
          rdExpenditure: 'N/A',
          industryComparison: 'N/A',
          technologySectors: [],
          innovationTrends: []
        }
      };
    }
  }

  private static analyzeInnovationMetrics(profile: any): any {
    if (!profile) return {};

    const sector = profile.sector || '';
    const industry = profile.industry || '';
    
    return {
      innovationScore: this.calculateInnovationScore(profile),
      rdExpenditure: profile.rdExpenses ? this.formatNumber(profile.rdExpenses) : 'N/A',
      industryComparison: `${industry} industry analysis`,
      technologySectors: this.inferTechnologySectors(sector, industry),
      innovationTrends: this.generateInnovationTrends(profile)
    };
  }

  private static calculateInnovationScore(profile: any): number {
    if (!profile) return 0;
    let score = 50; // Base score

    if (profile.rdExpenses) {
      score += Math.min((profile.rdExpenses / profile.revenue) * 100, 25);
    }
    
    // Adjust score based on sector
    const techSectors = ['Technology', 'Healthcare', 'Communications'];
    if (techSectors.includes(profile.sector)) {
      score += 15;
    }

    return Math.min(Math.round(score), 100);
  }

  private static inferTechnologySectors(sector: string, industry: string): string[] {
    const sectors = new Set<string>();
    
    if (sector) sectors.add(sector);
    if (industry) sectors.add(industry);
    
    // Add related technology sectors based on industry
    if (industry.includes('Software')) {
      sectors.add('Software Development');
      sectors.add('Cloud Computing');
    }
    if (industry.includes('Hardware')) {
      sectors.add('Hardware Manufacturing');
      sectors.add('Electronics');
    }

    return Array.from(sectors);
  }

  private static generateInnovationTrends(profile: any): string[] {
    const trends = [];
    
    if (profile.rdExpenses && profile.rdExpenses > 0) {
      trends.push('Active R&D Investment');
    }
    if (profile.sector === 'Technology') {
      trends.push('Technology Sector Innovation');
    }
    if (profile.industry?.includes('Software')) {
      trends.push('Software Development Focus');
    }

    return trends;
  }
}
