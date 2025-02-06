
import { BaseAgent, AnalysisResult } from './BaseAgent';

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
      const macroImpact = this.assessMacroImpact(economicData, sectorResponse);
      const sectorAnalysis = this.analyzeSectorPerformance(sectorResponse);
      const economicOutlook = this.analyzeEconomicData(economicData);
      const confidence = this.calculateConfidence(macroImpact, sectorAnalysis, economicOutlook);

      return {
        type: 'macroeconomic',
        analysis: {
          macroeconomicOutlook: {
            summary: this.generateMacroSummary(macroImpact, economicOutlook),
            confidence: confidence.toFixed(2) + '%',
            recommendation: this.generateRecommendation(macroImpact, confidence),
            priceImpact: this.calculatePriceImpact(currentPrice, macroImpact)
          },
          sectorAnalysis: {
            ...sectorAnalysis,
            sectorTrends: this.identifySectorTrends(sectorResponse)
          },
          economicIndicators: {
            gdp: this.findLatestValue(economicData, 'GDP'),
            inflation: this.findLatestValue(economicData, 'CPI'),
            unemployment: this.findLatestValue(economicData, 'UNEMPLOYMENT'),
            interestRate: this.findLatestValue(economicData, 'INTEREST_RATE')
          },
          riskFactors: this.identifyRiskFactors(economicData),
          pricePredictions: {
            threeMonths: this.generatePricePrediction(currentPrice, 3, confidence),
            sixMonths: this.generatePricePrediction(currentPrice, 6, confidence),
            twelveMonths: this.generatePricePrediction(currentPrice, 12, confidence),
            twentyFourMonths: this.generatePricePrediction(currentPrice, 24, confidence)
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

  private static assessMacroImpact(economicData: any[], sectorData: any): number {
    const gdpGrowth = this.calculateGDPGrowth(economicData);
    const inflationRate = this.findLatestValue(economicData, 'CPI');
    const unemploymentRate = this.findLatestValue(economicData, 'UNEMPLOYMENT');
    
    let impact = 0;
    impact += gdpGrowth > 2 ? 1 : gdpGrowth > 0 ? 0.5 : -0.5;
    impact += inflationRate < 3 ? 1 : inflationRate < 5 ? 0 : -1;
    impact += unemploymentRate < 5 ? 1 : unemploymentRate < 7 ? 0 : -1;
    
    return impact;
  }

  private static analyzeSectorPerformance(sectorData: any): any {
    if (!sectorData?.sectorPerformance) return {};

    const sectors = sectorData.sectorPerformance;
    const positiveCount = sectors.filter((s: any) => parseFloat(s.changesPercentage) > 0).length;
    const marketStrength = (positiveCount / sectors.length) * 100;

    return {
      marketStrength: marketStrength.toFixed(2) + '%',
      leadingSectors: this.getTopPerformers(sectors, 3),
      laggingSectors: this.getBottomPerformers(sectors, 3),
      overallTrend: this.determineTrend(marketStrength)
    };
  }

  private static getTopPerformers(sectors: any[], count: number): any[] {
    return sectors
      .sort((a, b) => parseFloat(b.changesPercentage) - parseFloat(a.changesPercentage))
      .slice(0, count)
      .map(s => ({
        sector: s.sector,
        performance: parseFloat(s.changesPercentage).toFixed(2) + '%'
      }));
  }

  private static getBottomPerformers(sectors: any[], count: number): any[] {
    return sectors
      .sort((a, b) => parseFloat(a.changesPercentage) - parseFloat(b.changesPercentage))
      .slice(0, count)
      .map(s => ({
        sector: s.sector,
        performance: parseFloat(s.changesPercentage).toFixed(2) + '%'
      }));
  }

  private static determineTrend(marketStrength: number): string {
    if (marketStrength > 70) return 'Strong Bullish';
    if (marketStrength > 50) return 'Moderately Bullish';
    if (marketStrength > 30) return 'Moderately Bearish';
    return 'Strong Bearish';
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

  private static calculateGDPGrowth(data: any[]): number {
    const gdpData = data.filter(d => d.indicator === 'GDP')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (gdpData.length < 2) return 0;
    
    const latest = Number(gdpData[0].value);
    const previous = Number(gdpData[1].value);
    return ((latest - previous) / previous) * 100;
  }

  private static calculateConfidence(macroImpact: number, sectorAnalysis: any, economicOutlook: any): number {
    let confidence = 70; // Base confidence

    // Adjust based on macro impact
    confidence += macroImpact * 10;

    // Adjust based on sector strength
    const sectorStrength = parseFloat(sectorAnalysis.marketStrength);
    confidence += (sectorStrength - 50) / 5;

    // Adjust based on economic conditions
    if (economicOutlook.gdpTrend === 'Expanding') confidence += 5;
    if (economicOutlook.inflationTrend === 'Falling') confidence += 5;

    // Ensure confidence stays within 0-100 range
    return Math.min(100, Math.max(0, confidence));
  }

  private static generatePricePrediction(currentPrice: number, months: number, confidence: number): {
    price: number;
    confidence: number;
  } {
    const volatility = 0.2; // 20% annual volatility
    const monthlyVolatility = volatility / Math.sqrt(12);
    const randomFactor = 1 + (Math.random() - 0.5) * monthlyVolatility * months;
    const trendFactor = 1 + (months / 12) * 0.08; // Assuming 8% annual trend

    return {
      price: Number((currentPrice * randomFactor * trendFactor).toFixed(2)),
      confidence: Number((confidence - (months * 2)).toFixed(2)) // Confidence decreases with time
    };
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

  private static calculatePriceImpact(currentPrice: number, macroImpact: number): any {
    const impactPercentage = macroImpact * 5; // Each impact point represents 5% potential price movement
    const priceChange = currentPrice * (impactPercentage / 100);
    
    return {
      direction: macroImpact > 0 ? 'Positive' : 'Negative',
      percentage: Math.abs(impactPercentage).toFixed(2) + '%',
      potentialPrice: (currentPrice + priceChange).toFixed(2)
    };
  }

  private static identifyRiskFactors(economicData: any[]): string[] {
    const risks = [];
    const inflation = this.findLatestValue(economicData, 'CPI');
    const unemployment = this.findLatestValue(economicData, 'UNEMPLOYMENT');
    const interestRate = this.findLatestValue(economicData, 'INTEREST_RATE');

    if (inflation > 4) risks.push(`High Inflation (${inflation.toFixed(2)}%)`);
    if (unemployment > 6) risks.push(`High Unemployment (${unemployment.toFixed(2)}%)`);
    if (interestRate > 5) risks.push(`High Interest Rates (${interestRate.toFixed(2)}%)`);

    return risks;
  }

  private static identifySectorTrends(sectorData: any): string[] {
    if (!sectorData?.sectorPerformance) return [];

    const trends = [];
    const sectors = sectorData.sectorPerformance;
    
    const cyclicals = sectors.filter((s: any) => 
      s.sector.includes('Consumer') || s.sector.includes('Industrial')
    );
    const defensive = sectors.filter((s: any) => 
      s.sector.includes('Utilities') || s.sector.includes('Healthcare')
    );

    const cyclicalAvg = this.calculateAveragePerformance(cyclicals);
    const defensiveAvg = this.calculateAveragePerformance(defensive);

    if (cyclicalAvg > defensiveAvg) {
      trends.push('Risk-on market environment');
    } else {
      trends.push('Defensive market positioning');
    }

    return trends;
  }

  private static calculateAveragePerformance(sectors: any[]): number {
    if (!sectors.length) return 0;
    return sectors.reduce((sum: number, sector: any) => 
      sum + parseFloat(sector.changesPercentage), 0) / sectors.length;
  }
}

