
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { CurrencyExposure, CurrencyRiskMetrics } from './types/currencyTypes';
import { analyzeCurrencyExposures } from './utils/currencyUtils';
import { calculateRiskMetrics } from './utils/currencyRiskAnalysis';
import { 
  generateSummary, 
  generateRecommendation, 
  calculateConfidence,
  identifyRisksAndOpportunities,
  recommendHedgingStrategies
} from './utils/currencyRecommendations';

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
      const currencyExposures = analyzeCurrencyExposures(profile, forexData);
      const riskMetrics = calculateRiskMetrics(profile, forexData);
      const confidence = calculateConfidence(currencyExposures, riskMetrics);
      const { risks, opportunities } = identifyRisksAndOpportunities(currencyExposures, riskMetrics);

      return {
        type: 'currency-exchange',
        analysis: {
          summary: {
            overview: generateSummary(currencyExposures, riskMetrics),
            confidence: confidence.toFixed(2) + '%',
            recommendation: generateRecommendation(currencyExposures, confidence)
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
          risks,
          opportunities,
          hedgingStrategies: recommendHedgingStrategies(currencyExposures, riskMetrics)
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

  private static compareHistoricalRates(forexData: any): Record<string, any> {
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

  private static assessShortTermImpact(exposures: CurrencyExposure, riskMetrics: CurrencyRiskMetrics): string {
    const volatility = riskMetrics.volatilityRisk;
    const exposure = exposures.exposureLevel;

    if (volatility === 'High' && exposure === 'High') {
      return 'Significant short-term volatility expected';
    }
    return 'Moderate short-term fluctuations likely';
  }

  private static assessMediumTermImpact(exposures: CurrencyExposure, riskMetrics: CurrencyRiskMetrics): string {
    const diversification = riskMetrics.diversificationScore;
    return diversification > 0.7 ? 
      'Well-diversified against medium-term risks' : 
      'Consider increasing currency diversification';
  }

  private static assessLongTermImpact(exposures: CurrencyExposure, riskMetrics: CurrencyRiskMetrics): string {
    const var_ = riskMetrics.valueAtRisk;
    return var_.includes('High') ?
      'Strategic hedging recommended for long-term stability' :
      'Maintain current long-term currency strategy';
  }
}
