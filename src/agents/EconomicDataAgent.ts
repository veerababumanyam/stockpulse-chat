
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class EconomicDataAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [economicData, stockProfile] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/economic?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${fmp}`,
          fmp
        )
      ]);

      const indicators = this.processEconomicIndicators(economicData);
      const trends = this.analyzeTrends(economicData);
      const impact = this.assessMarketImpact(economicData, stockProfile[0]);
      const confidence = this.calculateConfidenceScore(indicators, trends);

      return {
        type: 'economic-data',
        analysis: {
          summary: {
            overview: this.generateSummary(indicators, trends),
            confidence: confidence.toFixed(2) + '%',
            recommendation: this.generateRecommendation(impact, confidence)
          },
          indicators: {
            ...indicators,
            trends: trends,
            historicalComparison: this.compareHistoricalData(economicData)
          },
          impact: {
            ...impact,
            sectorSpecific: this.analyzeSectorImpact(stockProfile[0], indicators)
          },
          risks: this.identifyRisks(indicators, trends),
          opportunities: this.identifyOpportunities(indicators, trends),
          pricePredictions: this.generatePricePredictions(
            stockProfile[0]?.price || 0,
            impact,
            confidence
          )
        }
      };
    } catch (error) {
      console.error('Error in economic data analysis:', error);
      return {
        type: 'economic-data',
        analysis: {
          summary: {},
          indicators: {},
          impact: {},
          risks: [],
          opportunities: [],
          pricePredictions: {}
        }
      };
    }
  }

  private static processEconomicIndicators(data: any[]): any {
    if (!Array.isArray(data)) return {};

    return {
      gdp: {
        value: this.findLatestValue(data, 'GDP'),
        trend: this.calculateTrend(data, 'GDP'),
        growth: this.calculateGrowthRate(data, 'GDP')
      },
      inflation: {
        value: this.findLatestValue(data, 'CPI'),
        trend: this.calculateTrend(data, 'CPI'),
        monthlyChange: this.calculateMonthlyChange(data, 'CPI')
      },
      unemployment: {
        value: this.findLatestValue(data, 'UNEMPLOYMENT'),
        trend: this.calculateTrend(data, 'UNEMPLOYMENT'),
        monthlyChange: this.calculateMonthlyChange(data, 'UNEMPLOYMENT')
      },
      interestRate: {
        value: this.findLatestValue(data, 'INTEREST_RATE'),
        trend: this.calculateTrend(data, 'INTEREST_RATE'),
        monthlyChange: this.calculateMonthlyChange(data, 'INTEREST_RATE')
      }
    };
  }

  private static analyzeTrends(data: any[]): string[] {
    if (!Array.isArray(data)) return [];

    const trends = [];
    const gdpTrend = this.calculateTrend(data, 'GDP');
    const inflationTrend = this.calculateTrend(data, 'CPI');
    const unemploymentTrend = this.calculateTrend(data, 'UNEMPLOYMENT');
    
    if (gdpTrend > 0) trends.push('Economic Expansion');
    if (gdpTrend < 0) trends.push('Economic Contraction');
    if (inflationTrend > 0) trends.push('Rising Inflation');
    if (inflationTrend < 0) trends.push('Declining Inflation');
    if (unemploymentTrend < 0) trends.push('Improving Labor Market');
    if (unemploymentTrend > 0) trends.push('Weakening Labor Market');

    return trends;
  }

  private static calculateGrowthRate(data: any[], indicator: string): number {
    const values = data
      .filter(item => item.indicator === indicator)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (values.length < 2) return 0;

    const latest = Number(values[0].value);
    const previous = Number(values[1].value);
    return ((latest - previous) / previous) * 100;
  }

  private static calculateMonthlyChange(data: any[], indicator: string): number {
    const values = data
      .filter(item => item.indicator === indicator)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (values.length < 2) return 0;

    return Number(values[0].value) - Number(values[1].value);
  }

  private static assessMarketImpact(data: any[], profile: any): any {
    const gdpGrowth = this.calculateGrowthRate(data, 'GDP');
    const inflation = this.findLatestValue(data, 'CPI');
    const interestRate = this.findLatestValue(data, 'INTEREST_RATE');

    return {
      growthOutlook: this.assessGrowthOutlook(gdpGrowth, inflation),
      monetaryEnvironment: this.assessMonetaryEnvironment(interestRate, inflation),
      marketConditions: this.assessMarketConditions(gdpGrowth, inflation, interestRate),
      sectorImpact: this.assessSectorImpact(profile?.sector, gdpGrowth, inflation, interestRate)
    };
  }

  private static assessGrowthOutlook(gdpGrowth: number, inflation: number): string {
    if (gdpGrowth > 3 && inflation < 3) return 'Strong Growth Potential';
    if (gdpGrowth > 0 && inflation < 5) return 'Moderate Growth';
    if (gdpGrowth < 0 || inflation > 5) return 'Challenging Growth Environment';
    return 'Stable Growth Environment';
  }

  private static assessMonetaryEnvironment(interestRate: number, inflation: number): string {
    const realRate = interestRate - inflation;
    if (realRate < -2) return 'Highly Accommodative';
    if (realRate < 0) return 'Accommodative';
    if (realRate > 2) return 'Restrictive';
    return 'Neutral';
  }

  private static assessMarketConditions(gdp: number, inflation: number, rates: number): string {
    const score = (gdp * 0.4) - (inflation * 0.3) - (rates * 0.3);
    if (score > 2) return 'Very Favorable';
    if (score > 0) return 'Favorable';
    if (score > -2) return 'Challenging';
    return 'Very Challenging';
  }

  private static generatePricePredictions(currentPrice: number, impact: any, confidence: number): any {
    const generatePrediction = (months: number) => {
      const volatility = 0.2;
      const monthlyVolatility = volatility / Math.sqrt(12);
      const randomFactor = 1 + (Math.random() - 0.5) * monthlyVolatility * months;
      const impactFactor = impact.marketConditions === 'Very Favorable' ? 1.1 :
                          impact.marketConditions === 'Favorable' ? 1.05 :
                          impact.marketConditions === 'Challenging' ? 0.95 : 0.9;
      
      return {
        price: Number((currentPrice * randomFactor * impactFactor).toFixed(2)),
        confidence: Number((confidence - (months * 2)).toFixed(2))
      };
    };

    return {
      threeMonths: generatePrediction(3),
      sixMonths: generatePrediction(6),
      twelveMonths: generatePrediction(12),
      twentyFourMonths: generatePrediction(24)
    };
  }

  private static calculateConfidenceScore(indicators: any, trends: string[]): number {
    let score = 70; // Base confidence score

    // Adjust based on data quality and trends
    if (indicators.gdp && indicators.inflation && indicators.unemployment) score += 10;
    if (trends.length >= 3) score += 10;
    if (trends.includes('Economic Expansion')) score += 5;
    if (trends.includes('Rising Inflation')) score -= 5;

    return Math.min(100, Math.max(0, score));
  }

  private static generateSummary(indicators: any, trends: string[]): string {
    const gdpGrowth = indicators.gdp?.growth || 0;
    const inflation = indicators.inflation?.value || 0;

    if (gdpGrowth > 2 && inflation < 3) {
      return 'Strong economic conditions supporting market growth';
    } else if (gdpGrowth > 0 && inflation < 5) {
      return 'Moderate economic growth with manageable inflation';
    } else if (gdpGrowth < 0) {
      return 'Economic contraction signals caution';
    }
    return 'Mixed economic signals suggest careful positioning';
  }

  private static generateRecommendation(impact: any, confidence: number): string {
    if (impact.marketConditions === 'Very Favorable' && confidence > 70) {
      return 'Strong Buy - Optimal Economic Conditions';
    } else if (impact.marketConditions === 'Favorable' && confidence > 60) {
      return 'Buy - Positive Economic Environment';
    } else if (impact.marketConditions === 'Very Challenging' && confidence > 70) {
      return 'Strong Sell - Adverse Economic Conditions';
    } else if (impact.marketConditions === 'Challenging' && confidence > 60) {
      return 'Sell - Negative Economic Environment';
    }
    return 'Hold - Mixed Economic Signals';
  }

  private static analyzeSectorImpact(sector: string, indicators: any): string {
    const gdpGrowth = indicators.gdp?.growth || 0;
    const inflation = indicators.inflation?.value || 0;
    const interestRate = indicators.interestRate?.value || 0;

    const sectorSensitivity: Record<string, string> = {
      'Technology': gdpGrowth > 2 ? 'Positive' : 'Negative',
      'Financial': interestRate > 3 ? 'Positive' : 'Negative',
      'Consumer': inflation < 3 ? 'Positive' : 'Negative',
      'Industrial': gdpGrowth > 1 ? 'Positive' : 'Negative'
    };

    return sectorSensitivity[sector] || 'Neutral';
  }

  private static identifyRisks(indicators: any, trends: string[]): string[] {
    const risks = [];
    
    if (indicators.inflation?.value > 4) {
      risks.push('High Inflation Risk');
    }
    if (indicators.interestRate?.trend > 0) {
      risks.push('Rising Interest Rate Risk');
    }
    if (indicators.gdp?.growth < 1) {
      risks.push('Growth Slowdown Risk');
    }
    if (trends.includes('Economic Contraction')) {
      risks.push('Recession Risk');
    }

    return risks;
  }

  private static identifyOpportunities(indicators: any, trends: string[]): string[] {
    const opportunities = [];
    
    if (indicators.gdp?.growth > 2) {
      opportunities.push('Strong Growth Environment');
    }
    if (indicators.inflation?.trend < 0) {
      opportunities.push('Improving Price Stability');
    }
    if (trends.includes('Improving Labor Market')) {
      opportunities.push('Consumer Strength Potential');
    }

    return opportunities;
  }

  private static compareHistoricalData(data: any[]): any {
    const calculateAverage = (indicator: string) => {
      const values = data
        .filter(item => item.indicator === indicator)
        .map(item => Number(item.value));
      return values.reduce((a, b) => a + b, 0) / values.length;
    };

    return {
      gdp: {
        current: this.findLatestValue(data, 'GDP'),
        average: calculateAverage('GDP')
      },
      inflation: {
        current: this.findLatestValue(data, 'CPI'),
        average: calculateAverage('CPI')
      },
      unemployment: {
        current: this.findLatestValue(data, 'UNEMPLOYMENT'),
        average: calculateAverage('UNEMPLOYMENT')
      }
    };
  }

  private static assessSectorImpact(sector: string, gdpGrowth: number, inflation: number, interestRate: number): string {
    if (!sector) return 'Sector impact assessment unavailable';

    const sectorRatings: Record<string, (gdp: number, inf: number, rate: number) => string> = {
      'Technology': (gdp, inf, rate) => 
        gdp > 2 && rate < 4 ? 'Highly Positive' : 
        gdp > 0 ? 'Positive' : 'Negative',
      'Financial': (gdp, inf, rate) => 
        rate > 3 && gdp > 0 ? 'Highly Positive' : 
        rate > 2 ? 'Positive' : 'Negative',
      'Consumer': (gdp, inf, rate) => 
        gdp > 2 && inf < 3 ? 'Highly Positive' : 
        gdp > 0 && inf < 4 ? 'Positive' : 'Negative',
      'Industrial': (gdp, inf, rate) => 
        gdp > 2 ? 'Highly Positive' : 
        gdp > 0 ? 'Positive' : 'Negative'
    };

    const ratingFunction = sectorRatings[sector];
    return ratingFunction ? 
      ratingFunction(gdpGrowth, inflation, interestRate) : 
      'Sector-specific impact unknown';
  }
}

