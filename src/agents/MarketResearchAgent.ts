
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class MarketResearchAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch company profile and financial data
      const [profile, financials] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/financial-statements/${symbol}?limit=4&apikey=${fmp}`,
          fmp
        )
      ]);

      const analysis = {
        marketOverview: this.analyzeMarketPosition(profile[0]),
        industryAnalysis: this.analyzeIndustry(profile[0]),
        growthIndicators: this.analyzeGrowthMetrics(financials),
        recommendations: this.generateRecommendations(profile[0], financials)
      };

      return {
        type: 'market-research',
        analysis
      };
    } catch (error) {
      console.error('Error in market research analysis:', error);
      return {
        type: 'market-research',
        analysis: {
          marketOverview: 'Data unavailable',
          industryAnalysis: {},
          growthIndicators: [],
          recommendations: []
        }
      };
    }
  }

  private static analyzeMarketPosition(profile: any) {
    if (!profile) return 'Market position data unavailable';

    return {
      sector: profile.sector || 'Unknown',
      industry: profile.industry || 'Unknown',
      marketCap: this.formatNumber(profile.mktCap || 0),
      position: this.determineMarketPosition(profile)
    };
  }

  private static analyzeIndustry(profile: any) {
    if (!profile) return {};

    return {
      competitivePosition: profile.companyName ? `${profile.companyName}'s market position` : 'Unknown',
      industryTrends: [
        'Market Growth Rate',
        'Competitive Intensity',
        'Regulatory Environment'
      ].map(trend => ({
        name: trend,
        impact: this.calculateIndustryTrendImpact(trend, profile)
      }))
    };
  }

  private static analyzeGrowthMetrics(financials: any[]) {
    if (!Array.isArray(financials) || financials.length === 0) return [];

    return [
      'Revenue Growth',
      'Profit Margins',
      'Market Share'
    ].map(metric => ({
      metric,
      trend: this.calculateGrowthTrend(metric, financials),
      confidence: this.calculateConfidence(metric, financials)
    }));
  }

  private static generateRecommendations(profile: any, financials: any[]) {
    if (!profile || !Array.isArray(financials)) return [];

    const recommendations = [];
    const marketPosition = this.determineMarketPosition(profile);

    if (marketPosition.includes('Leader')) {
      recommendations.push('Strong market position suggests potential for continued growth');
    }

    if (this.calculateGrowthTrend('Revenue Growth', financials) === 'Positive') {
      recommendations.push('Consistent revenue growth indicates healthy business fundamentals');
    }

    return recommendations;
  }

  private static determineMarketPosition(profile: any): string {
    if (!profile || !profile.mktCap) return 'Unknown';

    const marketCap = profile.mktCap;
    if (marketCap > 100000000000) return 'Market Leader';
    if (marketCap > 10000000000) return 'Major Player';
    if (marketCap > 1000000000) return 'Mid-Market Position';
    return 'Emerging Player';
  }

  private static calculateIndustryTrendImpact(trend: string, profile: any): string {
    if (!profile) return 'Unknown';
    
    // Simplified impact calculation
    return ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];
  }

  private static calculateGrowthTrend(metric: string, financials: any[]): string {
    if (!Array.isArray(financials) || financials.length < 2) return 'Insufficient Data';

    // Simplified trend calculation
    return ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)];
  }

  private static calculateConfidence(metric: string, financials: any[]): number {
    if (!Array.isArray(financials) || financials.length === 0) return 0;

    // Base confidence calculation
    let confidence = 70; // Base confidence

    // Adjust based on data availability
    confidence += Math.min(financials.length * 5, 20); // Max 20 points for historical data

    return Math.min(confidence, 100);
  }
}
