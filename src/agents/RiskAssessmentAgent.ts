
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class RiskAssessmentAgent extends BaseAgent {
  static async analyze(stockData: any): Promise<AnalysisResult> {
    try {
      const riskMetrics = this.calculateRiskMetrics(stockData);
      const riskLevel = this.determineRiskLevel(riskMetrics);
      const warnings = this.generateWarnings(riskMetrics);

      return {
        type: 'risk',
        analysis: {
          riskLevel,
          riskMetrics,
          warnings
        }
      };
    } catch (error) {
      console.error('Error in risk assessment:', error);
      return {
        type: 'risk',
        analysis: {
          riskLevel: 'Unable to determine risk level',
          riskMetrics: {},
          warnings: ['Risk assessment data unavailable']
        }
      };
    }
  }

  private static calculateRiskMetrics(stockData: any) {
    const { quote, profile } = stockData;
    
    return {
      volatility: this.calculateVolatility(quote),
      debtLevel: profile.debtToEquityRatio || 'N/A',
      beta: quote.beta || 'N/A',
      priceVolatility: this.calculatePriceVolatility(quote)
    };
  }

  private static calculateVolatility(quote: any): string {
    if (!quote.priceAvg50 || !quote.price) return 'N/A';
    
    const volatility = Math.abs((quote.price - quote.priceAvg50) / quote.priceAvg50 * 100);
    return `${volatility.toFixed(2)}%`;
  }

  private static calculatePriceVolatility(quote: any): string {
    if (!quote.yearHigh || !quote.yearLow) return 'N/A';
    
    const range = ((quote.yearHigh - quote.yearLow) / quote.yearLow * 100);
    return `${range.toFixed(2)}%`;
  }

  private static determineRiskLevel(metrics: any): string {
    let riskScore = 0;
    
    // Evaluate volatility
    const volatility = parseFloat(metrics.volatility);
    if (!isNaN(volatility)) {
      if (volatility > 20) riskScore += 2;
      else if (volatility > 10) riskScore += 1;
    }

    // Evaluate debt level
    const debt = parseFloat(metrics.debtLevel);
    if (!isNaN(debt)) {
      if (debt > 2) riskScore += 2;
      else if (debt > 1) riskScore += 1;
    }

    // Evaluate beta
    const beta = parseFloat(metrics.beta);
    if (!isNaN(beta)) {
      if (beta > 1.5) riskScore += 2;
      else if (beta > 1) riskScore += 1;
    }

    if (riskScore >= 5) return 'High Risk';
    if (riskScore >= 3) return 'Moderate Risk';
    if (riskScore >= 1) return 'Low Risk';
    return 'Very Low Risk';
  }

  private static generateWarnings(metrics: any): string[] {
    const warnings: string[] = [];

    const volatility = parseFloat(metrics.volatility);
    if (!isNaN(volatility) && volatility > 20) {
      warnings.push('High price volatility detected');
    }

    const debt = parseFloat(metrics.debtLevel);
    if (!isNaN(debt) && debt > 2) {
      warnings.push('High debt levels');
    }

    const beta = parseFloat(metrics.beta);
    if (!isNaN(beta) && beta > 1.5) {
      warnings.push('High market sensitivity');
    }

    return warnings.length > 0 ? warnings : ['No significant risk warnings'];
  }
}
