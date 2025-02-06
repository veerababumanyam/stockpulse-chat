
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { assessMacroImpact, findLatestValue, calculateGDPGrowth } from './utils/macroCalculations';
import { analyzeSectorPerformance, identifySectorTrends } from './utils/sectorAnalysis';
import { generatePricePrediction, calculatePriceImpact } from './utils/pricePrediction';

export class MacroeconomicAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [sectorResponse, economicData, stockQuote] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/stock/sectors-performance?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/economic?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${fmp}`,
          fmp
        )
      ]);

      const currentPrice = stockQuote[0]?.price || 0;
      const macroImpact = assessMacroImpact(economicData, sectorResponse);
      const sectorAnalysis = analyzeSectorPerformance(sectorResponse);
      const economicOutlook = this.analyzeEconomicData(economicData);
      const confidence = this.calculateConfidence(macroImpact, sectorAnalysis, economicOutlook);

      return {
        type: 'macroeconomic',
        analysis: {
          macroeconomicOutlook: {
            summary: this.generateMacroSummary(macroImpact, economicOutlook),
            confidence: confidence.toFixed(2) + '%',
            recommendation: this.generateRecommendation(macroImpact, confidence),
            priceImpact: calculatePriceImpact(currentPrice, macroImpact)
          },
          sectorAnalysis: {
            ...sectorAnalysis,
            sectorTrends: identifySectorTrends(sectorResponse)
          },
          economicIndicators: {
            gdp: findLatestValue(economicData, 'GDP'),
            inflation: findLatestValue(economicData, 'CPI'),
            unemployment: findLatestValue(economicData, 'UNEMPLOYMENT'),
            interestRate: findLatestValue(economicData, 'INTEREST_RATE')
          },
          riskFactors: this.identifyRiskFactors(economicData),
          pricePredictions: {
            threeMonths: generatePricePrediction(currentPrice, 3, confidence),
            sixMonths: generatePricePrediction(currentPrice, 6, confidence),
            twelveMonths: generatePricePrediction(currentPrice, 12, confidence),
            twentyFourMonths: generatePricePrediction(currentPrice, 24, confidence)
          }
        }
      };
    } catch (error) {
      console.error('Error in macroeconomic analysis:', error);
      return {
        type: 'macroeconomic',
        analysis: {
          macroeconomicOutlook: { summary: 'Analysis unavailable', confidence: '0%' },
          sectorAnalysis: {},
          economicIndicators: {},
          riskFactors: [],
          pricePredictions: {}
        }
      };
    }
  }

  private static analyzeEconomicData(data: any[]): any {
    const gdpTrend = this.calculateTrend(data, 'GDP');
    const inflationTrend = this.calculateTrend(data, 'CPI');
    
    return {
      gdpTrend: gdpTrend > 0 ? 'Expanding' : 'Contracting',
      inflationTrend: inflationTrend > 0 ? 'Rising' : 'Falling',
      overallCondition: this.determineEconomicCondition(data)
    };
  }

  private static calculateConfidence(macroImpact: number, sectorAnalysis: any, economicOutlook: any): number {
    let confidence = 70; // Base confidence
    confidence += macroImpact * 10;
    const sectorStrength = parseFloat(sectorAnalysis.marketStrength);
    confidence += (sectorStrength - 50) / 5;
    if (economicOutlook.gdpTrend === 'Expanding') confidence += 5;
    if (economicOutlook.inflationTrend === 'Falling') confidence += 5;
    return Math.min(100, Math.max(0, confidence));
  }

  private static generateMacroSummary(macroImpact: number, economicOutlook: any): string {
    if (macroImpact > 1) {
      return 'Strong positive macroeconomic environment supporting growth';
    } else if (macroImpact > 0) {
      return 'Moderately positive macroeconomic conditions';
    } else if (macroImpact > -1) {
      return 'Challenging macroeconomic environment requiring caution';
    } else {
      return 'Significant macroeconomic headwinds present';
    }
  }

  private static generateRecommendation(macroImpact: number, confidence: number): string {
    if (macroImpact > 1 && confidence > 70) {
      return 'Strong Buy - Favorable Macro Environment';
    } else if (macroImpact > 0 && confidence > 60) {
      return 'Buy - Positive Macro Outlook';
    } else if (macroImpact < -1 && confidence > 70) {
      return 'Strong Sell - Unfavorable Macro Environment';
    } else if (macroImpact < 0 && confidence > 60) {
      return 'Sell - Negative Macro Outlook';
    }
    return 'Hold - Mixed Macro Signals';
  }

  private static identifyRiskFactors(economicData: any[]): string[] {
    const risks = [];
    const inflation = findLatestValue(economicData, 'CPI');
    const unemployment = findLatestValue(economicData, 'UNEMPLOYMENT');
    const interestRate = findLatestValue(economicData, 'INTEREST_RATE');

    if (inflation > 4) risks.push(`High Inflation (${inflation.toFixed(2)}%)`);
    if (unemployment > 6) risks.push(`High Unemployment (${unemployment.toFixed(2)}%)`);
    if (interestRate > 5) risks.push(`High Interest Rates (${interestRate.toFixed(2)}%)`);

    return risks;
  }
}
