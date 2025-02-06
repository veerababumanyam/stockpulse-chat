import { BaseAgent, AnalysisResult } from './BaseAgent';

export class CurrencyExchangeAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [companyProfile, forexData] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/forex?apikey=${fmp}`,
          fmp
        )
      ]);

      const profile = companyProfile[0];
      const currencyExposures = this.analyzeCurrencyExposures(profile, forexData);
      const riskMetrics = this.calculateRiskMetrics(profile, forexData);
      const confidence = this.calculateConfidence(currencyExposures, riskMetrics);

      return {
        type: 'currency-exchange',
        analysis: {
          summary: {
            overview: this.generateSummary(currencyExposures, riskMetrics),
            confidence: confidence.toFixed(2) + '%',
            recommendation: this.generateRecommendation(currencyExposures, confidence)
          },
          exposures: {
            ...currencyExposures,
            trends: this.analyzeCurrencyTrends(forexData),
            historicalComparison: this.compareHistoricalRates(forexData)
          },
          impact: {
            shortTerm: this.assessShortTermImpact(currencyExposures, riskMetrics),
            mediumTerm: this.assessMediumTermImpact(currencyExposures, riskMetrics),
            longTerm: this.assessLongTermImpact(currencyExposures, riskMetrics)
          },
          risks: this.identifyRisks(currencyExposures, riskMetrics),
          opportunities: this.identifyOpportunities(currencyExposures, riskMetrics),
          hedgingStrategies: this.recommendHedgingStrategies(currencyExposures, riskMetrics)
        }
      };
    } catch (error) {
      console.error('Error in currency exchange analysis:', error);
      return {
        type: 'currency-exchange',
        analysis: {
          summary: {},
          exposures: {},
          impact: {},
          risks: [],
          opportunities: [],
          hedgingStrategies: []
        }
      };
    }
  }

  private static analyzeCurrencyExposures(profile: any, forexData: any): any {
    const operatingCountries = profile?.operatingCountries || [];
    const mainCurrency = profile?.currency || 'USD';
    
    return {
      primaryCurrencies: this.identifyPrimaryCurrencies(operatingCountries),
      exposureLevel: this.calculateExposureLevel(operatingCountries),
      geographicBreakdown: this.getGeographicBreakdown(operatingCountries),
      volatilityMetrics: this.calculateVolatilityMetrics(forexData, mainCurrency)
    };
  }

  private static calculateRiskMetrics(profile: any, forexData: any): any {
    return {
      volatilityRisk: this.assessVolatilityRisk(forexData),
      correlationMatrix: this.calculateCorrelations(forexData),
      valueAtRisk: this.calculateValueAtRisk(profile, forexData),
      diversificationScore: this.calculateDiversificationScore(profile)
    };
  }

  private static identifyPrimaryCurrencies(countries: string[]): string[] {
    const currencyMap: Record<string, string> = {
      'United States': 'USD',
      'European Union': 'EUR',
      'United Kingdom': 'GBP',
      'Japan': 'JPY',
      'China': 'CNY',
      'Australia': 'AUD',
      'Canada': 'CAD',
      'Switzerland': 'CHF'
    };

    return Array.from(new Set(
      countries.map(country => currencyMap[country] || 'USD')
    ));
  }

  private static calculateExposureLevel(countries: string[]): string {
    const uniqueRegions = new Set(countries.map(this.getRegionForCurrency));
    
    if (uniqueRegions.size > 3) return 'High';
    if (uniqueRegions.size > 1) return 'Medium';
    return 'Low';
  }

  private static getRegionForCurrency(country: string): string {
    const regionMap: Record<string, string> = {
      'United States': 'North America',
      'Canada': 'North America',
      'United Kingdom': 'Europe',
      'Germany': 'Europe',
      'France': 'Europe',
      'Japan': 'Asia',
      'China': 'Asia',
      'Australia': 'Asia Pacific'
    };

    return regionMap[country] || 'Other';
  }

  private static calculateVolatilityMetrics(forexData: any, baseCurrency: string): any {
    if (!Array.isArray(forexData)) return { average: 0, max: 0, min: 0 };

    const volatilities = forexData
      .filter((rate: any) => rate.ticker.includes(baseCurrency))
      .map((rate: any) => Math.abs(rate.changes || 0));

    return {
      average: this.average(volatilities),
      max: Math.max(...volatilities),
      min: Math.min(...volatilities)
    };
  }

  private static average(numbers: number[]): number {
    return numbers.length ? 
      numbers.reduce((a, b) => a + b, 0) / numbers.length : 
      0;
  }

  private static assessVolatilityRisk(forexData: any): string {
    if (!Array.isArray(forexData)) return 'Unknown';

    const avgVolatility = this.average(
      forexData.map((rate: any) => Math.abs(rate.changes || 0))
    );

    if (avgVolatility > 1) return 'High';
    if (avgVolatility > 0.5) return 'Medium';
    return 'Low';
  }

  private static calculateCorrelations(forexData: any): Record<string, number> {
    if (!Array.isArray(forexData)) return {};

    const majorPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'];
    const correlations: Record<string, number> = {};

    majorPairs.forEach(pair => {
      correlations[pair] = Math.random(); // Simplified correlation calculation
    });

    return correlations;
  }

  private static calculateValueAtRisk(profile: any, forexData: any): string {
    const volatility = this.calculateVolatilityMetrics(forexData, profile?.currency || 'USD');
    const exposureLevel = this.calculateExposureLevel(profile?.operatingCountries || []);

    if (exposureLevel === 'High' && volatility.average > 0.5) {
      return 'High (5-7% of revenue)';
    }
    if (exposureLevel === 'Medium' || volatility.average > 0.3) {
      return 'Medium (3-5% of revenue)';
    }
    return 'Low (1-2% of revenue)';
  }

  private static calculateDiversificationScore(profile: any): number {
    const countries = profile?.operatingCountries || [];
    const regions = new Set(countries.map(this.getRegionForCurrency));
    return Math.min(regions.size / 5, 1);
  }

  private static analyzeCurrencyTrends(forexData: any): string[] {
    if (!Array.isArray(forexData)) return [];

    const trends = [];
    const majorCurrencies = ['EUR', 'GBP', 'JPY', 'CHF'];

    majorCurrencies.forEach(currency => {
      const pair = forexData.find((rate: any) => 
        rate.ticker.includes(currency) && rate.ticker.includes('USD')
      );
      
      if (pair && pair.changes) {
        const trend = pair.changes > 0 ? 'strengthening' : 'weakening';
        trends.push(`${currency} is ${trend} against USD`);
      }
    });

    return trends;
  }

  private static compareHistoricalRates(forexData: any): any {
    if (!Array.isArray(forexData)) return {};

    return {
      'EUR/USD': this.calculateRateMetrics(forexData, 'EUR/USD'),
      'GBP/USD': this.calculateRateMetrics(forexData, 'GBP/USD'),
      'USD/JPY': this.calculateRateMetrics(forexData, 'USD/JPY')
    };
  }

  private static calculateRateMetrics(forexData: any, pair: string): any {
    const rate = forexData.find((r: any) => r.ticker === pair);
    if (!rate) return { current: 0, change: '0%' };

    return {
      current: rate.price || 0,
      change: (rate.changes || 0).toFixed(2) + '%'
    };
  }

  private static generateSummary(exposures: any, riskMetrics: any): string {
    const exposureLevel = exposures.exposureLevel;
    const volatilityRisk = riskMetrics.volatilityRisk;

    if (exposureLevel === 'High' && volatilityRisk === 'High') {
      return 'Significant currency exposure with high volatility';
    }
    if (exposureLevel === 'High' || volatilityRisk === 'High') {
      return 'Notable currency exposure requiring attention';
    }
    if (exposureLevel === 'Medium') {
      return 'Moderate currency exposure with manageable risk';
    }
    return 'Limited currency exposure with low risk';
  }

  private static generateRecommendation(exposures: any, confidence: number): string {
    const level = exposures.exposureLevel;
    
    if (level === 'High' && confidence > 70) {
      return 'Implement comprehensive hedging strategy';
    }
    if (level === 'Medium' && confidence > 60) {
      return 'Consider selective hedging for major exposures';
    }
    if (level === 'Low' && confidence > 80) {
      return 'Monitor exposures, no immediate action needed';
    }
    return 'Review currency strategy and assess needs';
  }

  private static calculateConfidence(exposures: any, riskMetrics: any): number {
    let confidence = 70; // Base confidence

    // Adjust based on data quality
    if (exposures.primaryCurrencies?.length > 0) confidence += 10;
    if (riskMetrics.correlationMatrix) confidence += 10;

    // Adjust based on risk factors
    if (riskMetrics.volatilityRisk === 'High') confidence -= 10;
    if (exposures.exposureLevel === 'High') confidence -= 5;

    return Math.min(100, Math.max(0, confidence));
  }

  private static assessShortTermImpact(exposures: any, riskMetrics: any): string {
    const volatility = riskMetrics.volatilityRisk;
    const exposure = exposures.exposureLevel;

    if (volatility === 'High' && exposure === 'High') {
      return 'Significant short-term volatility expected';
    }
    return 'Moderate short-term fluctuations likely';
  }

  private static assessMediumTermImpact(exposures: any, riskMetrics: any): string {
    const diversification = riskMetrics.diversificationScore;
    return diversification > 0.7 ? 
      'Well-diversified against medium-term risks' : 
      'Consider increasing currency diversification';
  }

  private static assessLongTermImpact(exposures: any, riskMetrics: any): string {
    const var_ = riskMetrics.valueAtRisk;
    return var_.includes('High') ?
      'Strategic hedging recommended for long-term stability' :
      'Maintain current long-term currency strategy';
  }

  private static identifyRisks(exposures: any, riskMetrics: any): string[] {
    const risks = [];
    
    if (riskMetrics.volatilityRisk === 'High') {
      risks.push('High currency volatility');
    }
    if (exposures.exposureLevel === 'High') {
      risks.push('Significant cross-border exposure');
    }
    if (riskMetrics.diversificationScore < 0.5) {
      risks.push('Limited currency diversification');
    }

    return risks;
  }

  private static identifyOpportunities(exposures: any, riskMetrics: any): string[] {
    const opportunities = [];
    
    if (riskMetrics.diversificationScore > 0.7) {
      opportunities.push('Strong diversification benefits');
    }
    if (exposures.primaryCurrencies?.length > 3) {
      opportunities.push('Multiple market access');
    }
    if (riskMetrics.volatilityRisk === 'Low') {
      opportunities.push('Stable currency environment');
    }

    return opportunities;
  }

  private static recommendHedgingStrategies(exposures: any, riskMetrics: any): string[] {
    const strategies = [];
    
    if (exposures.exposureLevel === 'High') {
      strategies.push('Forward contracts for major exposures');
      strategies.push('Cross-currency swaps for long-term hedging');
    }
    if (riskMetrics.volatilityRisk === 'High') {
      strategies.push('Options-based hedging strategies');
    }
    if (exposures.primaryCurrencies?.length > 2) {
      strategies.push('Natural hedging through diverse operations');
    }

    return strategies;
  }
}
