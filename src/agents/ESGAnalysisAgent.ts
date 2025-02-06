
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class ESGAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch ESG data
      const esgResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data?symbol=${symbol}&apikey=${fmp}`,
        fmp
      );

      return {
        type: 'esg',
        analysis: {
          environmentalScore: this.calculateEnvironmentalScore(esgResponse),
          socialScore: this.calculateSocialScore(esgResponse),
          governanceScore: this.calculateGovernanceScore(esgResponse),
          overallESGRating: this.calculateOverallESG(esgResponse)
        }
      };
    } catch (error) {
      console.error('Error in ESG analysis:', error);
      return {
        type: 'esg',
        analysis: {
          environmentalScore: 'N/A',
          socialScore: 'N/A',
          governanceScore: 'N/A',
          overallESGRating: 'ESG data unavailable'
        }
      };
    }
  }

  private static calculateEnvironmentalScore(data: any): string {
    if (!data || !data[0]) return 'N/A';
    const score = data[0].environmentalScore;
    return this.formatScore(score);
  }

  private static calculateSocialScore(data: any): string {
    if (!data || !data[0]) return 'N/A';
    const score = data[0].socialScore;
    return this.formatScore(score);
  }

  private static calculateGovernanceScore(data: any): string {
    if (!data || !data[0]) return 'N/A';
    const score = data[0].governanceScore;
    return this.formatScore(score);
  }

  private static calculateOverallESG(data: any): string {
    if (!data || !data[0]) return 'ESG data unavailable';
    
    const scores = [
      data[0].environmentalScore,
      data[0].socialScore,
      data[0].governanceScore
    ].filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 'Insufficient data';
    
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (average >= 80) return 'Excellent ESG Performance';
    if (average >= 60) return 'Good ESG Performance';
    if (average >= 40) return 'Average ESG Performance';
    return 'Below Average ESG Performance';
  }

  private static formatScore(score: number | null | undefined): string {
    if (score === null || score === undefined) return 'N/A';
    return `${score.toFixed(1)}/100`;
  }
}
