
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { processEconomicIndicators, analyzeTrends } from './utils/economicIndicators';
import { assessMarketImpact } from './utils/economicImpact';
import { calculateConfidenceScore, generateSummary, generateRecommendation } from './utils/confidenceCalculator';
import { generatePricePrediction } from './utils/pricePrediction';

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

      const indicators = processEconomicIndicators(economicData, this.findLatestValue, this.calculateTrend);
      const trends = analyzeTrends(economicData, this.calculateTrend);
      const impact = assessMarketImpact(economicData, stockProfile[0], this.findLatestValue);
      const confidence = calculateConfidenceScore(indicators, trends);

      return {
        type: 'economic-data',
        analysis: {
          summary: {
            overview: generateSummary(indicators, trends),
            confidence: confidence.toFixed(2) + '%',
            recommendation: generateRecommendation(impact, confidence)
          },
          indicators: {
            ...indicators,
            trends: trends,
            historicalComparison: this.compareHistoricalData(economicData)
          },
          impact: {
            ...impact,
            sectorSpecific: this.analyzeSectorImpact(stockProfile[0]?.sector, indicators)
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
}

