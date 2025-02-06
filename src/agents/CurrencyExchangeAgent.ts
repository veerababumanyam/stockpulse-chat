
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CurrencyExchangeAgent extends BaseAgent {
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
        type: 'currency-exchange',
        analysis: {
          exposures: this.analyzeCurrencyExposures(companyProfile[0]),
          riskMetrics: this.calculateRiskMetrics(companyProfile[0]),
          hedgingRecommendations: this.generateHedgingRecommendations(companyProfile[0])
        }
      };
    } catch (error) {
      console.error('Error in currency exchange analysis:', error);
      return {
        type: 'currency-exchange',
        analysis: {
          exposures: {},
          riskMetrics: {},
          hedgingRecommendations: []
        }
      };
    }
  }

  private static analyzeCurrencyExposures(profile: any): any {
    if (!profile) return {};

    return {
      primaryCurrencies: this.identifyPrimaryCurrencies(profile),
      exposureLevel: this.calculateExposureLevel(profile),
      geographicBreakdown: this.getGeographicBreakdown(profile)
    };
  }

  private static calculateRiskMetrics(profile: any): any {
    if (!profile) return {};

    return {
      volatilityRisk: this.assessVolatilityRisk(profile),
      correlationMetrics: this.calculateCorrelations(profile),
      valueAtRisk: this.calculateValueAtRisk(profile)
    };
  }

  private static generateHedgingRecommendations(profile: any): string[] {
    if (!profile) return [];

    const exposureLevel = this.calculateExposureLevel(profile);
    const recommendations = [];

    if (exposureLevel === 'High') {
      recommendations.push(
        'Implement forward contracts for major currency exposures',
        'Consider currency swaps for long-term hedging',
        'Diversify currency holdings'
      );
    } else if (exposureLevel === 'Medium') {
      recommendations.push(
        'Monitor major currency movements',
        'Selective hedging for significant exposures'
      );
    }

    return recommendations;
  }

  private static identifyPrimaryCurrencies(profile: any): string[] {
    if (!profile?.country) return ['USD'];
    
    const currencyMap: Record<string, string> = {
      'United States': 'USD',
      'European Union': 'EUR',
      'United Kingdom': 'GBP',
      'Japan': 'JPY',
      'China': 'CNY'
    };

    return [currencyMap[profile.country] || 'USD'];
  }

  private static calculateExposureLevel(profile: any): string {
    if (!profile) return 'Low';
    
    if (profile.isInternational) return 'High';
    if (profile.hasOverseasOperations) return 'Medium';
    return 'Low';
  }

  private static getGeographicBreakdown(profile: any): Record<string, string> {
    if (!profile?.country) return { 'Domestic': '100%' };

    if (profile.isInternational) {
      return {
        'Domestic': '60%',
        'International': '40%'
      };
    }

    return { 'Domestic': '100%' };
  }

  private static assessVolatilityRisk(profile: any): string {
    if (!profile) return 'Low';
    
    if (profile.isInternational) return 'High';
    if (profile.hasOverseasOperations) return 'Medium';
    return 'Low';
  }

  private static calculateCorrelations(profile: any): Record<string, number> {
    return {
      'EUR/USD': 0.7,
      'GBP/USD': 0.6,
      'JPY/USD': -0.3
    };
  }

  private static calculateValueAtRisk(profile: any): string {
    if (!profile) return 'Low';
    
    if (profile.isInternational) return 'High (5-7% of revenue)';
    if (profile.hasOverseasOperations) return 'Medium (3-5% of revenue)';
    return 'Low (1-2% of revenue)';
  }
}
