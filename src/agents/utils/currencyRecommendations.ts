
import { CurrencyExposure, CurrencyRiskMetrics } from '../types/currencyTypes';

export const generateSummary = (exposures: CurrencyExposure, riskMetrics: CurrencyRiskMetrics): string => {
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
};

export const generateRecommendation = (exposures: CurrencyExposure, confidence: number): string => {
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
};

export const calculateConfidence = (exposures: CurrencyExposure, riskMetrics: CurrencyRiskMetrics): number => {
  let confidence = 70; // Base confidence

  if (exposures.primaryCurrencies?.length > 0) confidence += 10;
  if (riskMetrics.correlationMatrix) confidence += 10;
  if (riskMetrics.volatilityRisk === 'High') confidence -= 10;
  if (exposures.exposureLevel === 'High') confidence -= 5;

  return Math.min(100, Math.max(0, confidence));
};

export const identifyRisksAndOpportunities = (exposures: CurrencyExposure, riskMetrics: CurrencyRiskMetrics) => {
  const risks: string[] = [];
  const opportunities: string[] = [];
  
  if (riskMetrics.volatilityRisk === 'High') {
    risks.push('High currency volatility');
  }
  if (exposures.exposureLevel === 'High') {
    risks.push('Significant cross-border exposure');
  }
  if (riskMetrics.diversificationScore < 0.5) {
    risks.push('Limited currency diversification');
  }

  if (riskMetrics.diversificationScore > 0.7) {
    opportunities.push('Strong diversification benefits');
  }
  if (exposures.primaryCurrencies?.length > 3) {
    opportunities.push('Multiple market access');
  }
  if (riskMetrics.volatilityRisk === 'Low') {
    opportunities.push('Stable currency environment');
  }

  return { risks, opportunities };
};

export const recommendHedgingStrategies = (exposures: CurrencyExposure, riskMetrics: CurrencyRiskMetrics): string[] => {
  const strategies: string[] = [];
  
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
};
