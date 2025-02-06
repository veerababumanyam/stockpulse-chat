
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class BayesianInferenceAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [quote, profile] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${fmp}`,
          fmp
        )
      ]);

      if (!quote[0] || !profile[0]) {
        throw new Error('Insufficient data for analysis');
      }

      const priorBeliefs = this.calculatePriorBeliefs(quote[0], profile[0]);
      const evidenceStrength = this.calculateEvidenceStrength(quote[0]);
      const posteriorDistribution = this.updatePosteriorDistribution(priorBeliefs, evidenceStrength);

      return {
        type: 'bayesian-inference',
        analysis: {
          posteriorDistribution,
          priorBeliefs,
          evidenceStrength,
          uncertaintyMetrics: this.calculateUncertaintyMetrics(quote[0], profile[0])
        }
      };
    } catch (error) {
      console.error('Error in Bayesian inference analysis:', error);
      return {
        type: 'bayesian-inference',
        analysis: {
          posteriorDistribution: {},
          priorBeliefs: {},
          evidenceStrength: 0,
          uncertaintyMetrics: {}
        }
      };
    }
  }

  private static calculatePriorBeliefs(quote: any, profile: any): any {
    const beta = profile.beta || 1;
    const volatility = quote.changesPercentage || 0;
    
    return {
      expectedReturn: Number((quote.changesPercentage || 0).toFixed(2)),
      volatility: Number(Math.abs(volatility).toFixed(2)),
      marketCondition: this.determineMarketCondition(quote),
      sectorOutlook: this.determineSectorOutlook(profile)
    };
  }

  private static calculateEvidenceStrength(quote: any): number {
    const volumeStrength = quote.volume > quote.avgVolume ? 0.2 : 0.1;
    const priceStrength = Math.abs(quote.changesPercentage) > 2 ? 0.2 : 0.1;
    const baseStrength = 0.6;

    return Number((baseStrength + volumeStrength + priceStrength).toFixed(2));
  }

  private static updatePosteriorDistribution(priors: any, evidenceStrength: number): any {
    const currentPrice = priors.currentPrice || 100;
    const volatility = priors.volatility || 1;
    
    return {
      mean: Number((currentPrice * (1 + priors.expectedReturn / 100)).toFixed(2)),
      variance: Number((volatility * (1 - evidenceStrength)).toFixed(2)),
      credibleIntervals: {
        lower95: Number((currentPrice * (1 - 2 * volatility / 100)).toFixed(2)),
        upper95: Number((currentPrice * (1 + 2 * volatility / 100)).toFixed(2))
      }
    };
  }

  private static calculateUncertaintyMetrics(quote: any, profile: any): any {
    const baseUncertainty = 0.3;
    const marketUncertainty = Math.abs(quote.changesPercentage) > 2 ? 0.2 : 0.1;
    const sectorUncertainty = profile.beta > 1.2 ? 0.2 : 0.1;

    return {
      modelUncertainty: Number((baseUncertainty + marketUncertainty).toFixed(2)),
      dataUncertainty: Number((baseUncertainty + sectorUncertainty).toFixed(2)),
      totalUncertainty: Number((baseUncertainty + marketUncertainty + sectorUncertainty).toFixed(2))
    };
  }

  private static determineMarketCondition(quote: any): string {
    const change = quote.changesPercentage || 0;
    if (change > 2) return 'bullish';
    if (change < -2) return 'bearish';
    return 'neutral';
  }

  private static determineSectorOutlook(profile: any): string {
    const beta = profile.beta || 1;
    if (beta > 1.2) return 'volatile';
    if (beta < 0.8) return 'defensive';
    return 'stable';
  }
}
