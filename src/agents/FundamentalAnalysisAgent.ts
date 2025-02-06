
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { calculateConfidenceScore, generateSummary, generateRecommendation, calculatePricePrediction } from './utils/confidenceCalculator';

export class FundamentalAnalysisAgent extends BaseAgent {
  static async analyze(stockData: any): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const { quote, profile } = stockData;
      
      // Fetch additional data from FMP
      const [ratios, growth, metrics] = await Promise.all([
        this.fetchData(`https://financialmodelingprep.com/api/v3/ratios/${quote.symbol}?limit=1&apikey=${fmp}`, fmp),
        this.fetchData(`https://financialmodelingprep.com/api/v3/financial-growth/${quote.symbol}?limit=1&apikey=${fmp}`, fmp),
        this.fetchData(`https://financialmodelingprep.com/api/v3/key-metrics/${quote.symbol}?limit=1&apikey=${fmp}`, fmp)
      ]);

      const fundamentalIndicators = this.processFundamentalData(quote, profile, ratios[0], growth[0], metrics[0]);
      const trends = this.identifyTrends(fundamentalIndicators);
      const impact = this.assessMarketImpact(fundamentalIndicators, trends);
      const confidence = calculateConfidenceScore(fundamentalIndicators, trends);

      return {
        type: 'fundamental',
        analysis: {
          summary: {
            overview: generateSummary(fundamentalIndicators, trends),
            confidence: confidence.toFixed(2) + '%',
            recommendation: generateRecommendation(impact, confidence)
          },
          valuationMetrics: {
            peRatio: Number(fundamentalIndicators.peRatio).toFixed(2),
            pbRatio: Number(fundamentalIndicators.pbRatio).toFixed(2),
            evEbitda: Number(fundamentalIndicators.evEbitda).toFixed(2),
            marketCap: this.formatNumber(quote.marketCap)
          },
          financialHealth: {
            currentRatio: Number(fundamentalIndicators.currentRatio).toFixed(2),
            debtToEquity: Number(fundamentalIndicators.debtToEquity).toFixed(2),
            quickRatio: Number(fundamentalIndicators.quickRatio).toFixed(2)
          },
          profitability: {
            grossMargin: (fundamentalIndicators.grossMargin * 100).toFixed(2) + '%',
            operatingMargin: (fundamentalIndicators.operatingMargin * 100).toFixed(2) + '%',
            netMargin: (fundamentalIndicators.netMargin * 100).toFixed(2) + '%',
            roeFiscalYear: (fundamentalIndicators.roe * 100).toFixed(2) + '%'
          },
          growthMetrics: {
            revenueGrowth: (fundamentalIndicators.revenueGrowth * 100).toFixed(2) + '%',
            earningsGrowth: (fundamentalIndicators.earningsGrowth * 100).toFixed(2) + '%',
            fcfGrowth: (fundamentalIndicators.fcfGrowth * 100).toFixed(2) + '%'
          },
          pricePredictions: {
            threeMonths: calculatePricePrediction(quote.price, fundamentalIndicators.earningsGrowth, confidence, 3),
            sixMonths: calculatePricePrediction(quote.price, fundamentalIndicators.earningsGrowth, confidence, 6),
            twelveMonths: calculatePricePrediction(quote.price, fundamentalIndicators.earningsGrowth, confidence, 12),
            twentyFourMonths: calculatePricePrediction(quote.price, fundamentalIndicators.earningsGrowth, confidence, 24)
          }
        }
      };
    } catch (error) {
      console.error('Error in fundamental analysis:', error);
      return {
        type: 'fundamental',
        analysis: {
          summary: {
            overview: 'Analysis unavailable',
            confidence: '0%',
            recommendation: 'Unable to generate recommendation'
          },
          valuationMetrics: {},
          financialHealth: {},
          profitability: {},
          growthMetrics: {},
          pricePredictions: {}
        }
      };
    }
  }

  private static processFundamentalData(quote: any, profile: any, ratios: any, growth: any, metrics: any): any {
    return {
      peRatio: quote.pe || ratios?.priceEarningsRatio,
      pbRatio: ratios?.priceToBookRatio,
      evEbitda: ratios?.enterpriseValueMultiple,
      currentRatio: ratios?.currentRatio,
      debtToEquity: ratios?.debtToEquityRatio,
      quickRatio: ratios?.quickRatio,
      grossMargin: metrics?.grossProfitMargin,
      operatingMargin: metrics?.operatingProfitMargin,
      netMargin: metrics?.netProfitMargin,
      roe: metrics?.roe,
      revenueGrowth: growth?.revenueGrowth,
      earningsGrowth: growth?.epsgrowth,
      fcfGrowth: growth?.freeCashFlowGrowth
    };
  }

  private static identifyTrends(indicators: any): string[] {
    const trends: string[] = [];
    
    if (indicators.earningsGrowth > 0.1) trends.push('Strong Earnings Growth');
    if (indicators.revenueGrowth > 0.1) trends.push('Strong Revenue Growth');
    if (indicators.debtToEquity < 1) trends.push('Healthy Debt Levels');
    if (indicators.peRatio < 15) trends.push('Value Territory');
    if (indicators.roe > 0.15) trends.push('Strong ROE');
    
    return trends;
  }

  private static assessMarketImpact(indicators: any, trends: string[]): any {
    const positiveFactors = trends.filter(t => 
      t.includes('Strong') || t.includes('Healthy') || t.includes('Value')
    ).length;

    return {
      marketConditions: positiveFactors >= 3 ? 'Very Favorable' :
                       positiveFactors >= 2 ? 'Favorable' :
                       positiveFactors >= 1 ? 'Challenging' : 'Very Challenging',
      strengthScore: (positiveFactors / trends.length) * 100
    };
  }
}
