
import { CurrencyRiskMetrics } from '../types/currencyTypes';
import { average } from './currencyUtils';

export const calculateRiskMetrics = (profile: any, forexData: any): CurrencyRiskMetrics => {
  return {
    volatilityRisk: assessVolatilityRisk(forexData),
    correlationMatrix: calculateCorrelations(forexData),
    valueAtRisk: calculateValueAtRisk(profile, forexData),
    diversificationScore: calculateDiversificationScore(profile)
  };
};

const assessVolatilityRisk = (forexData: any): string => {
  if (!Array.isArray(forexData)) return 'Unknown';

  const avgVolatility = average(
    forexData.map((rate: any) => Math.abs(rate.changes || 0))
  );

  if (avgVolatility > 1) return 'High';
  if (avgVolatility > 0.5) return 'Medium';
  return 'Low';
};

const calculateCorrelations = (forexData: any): Record<string, number> => {
  if (!Array.isArray(forexData)) return {};

  const majorPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'];
  const correlations: Record<string, number> = {};

  majorPairs.forEach(pair => {
    correlations[pair] = Math.random(); // Simplified correlation calculation
  });

  return correlations;
};

const calculateValueAtRisk = (profile: any, forexData: any): string => {
  const volatility = calculateVolatilityMetrics(forexData, profile?.currency || 'USD');
  const exposureLevel = calculateExposureLevel(profile?.operatingCountries || []);

  if (exposureLevel === 'High' && volatility.average > 0.5) {
    return 'High (5-7% of revenue)';
  }
  if (exposureLevel === 'Medium' || volatility.average > 0.3) {
    return 'Medium (3-5% of revenue)';
  }
  return 'Low (1-2% of revenue)';
};

const calculateDiversificationScore = (profile: any): number => {
  const countries = profile?.operatingCountries || [];
  const regions = new Set(countries.map(getRegionForCurrency));
  return Math.min(regions.size / 5, 1);
};

const calculateVolatilityMetrics = (forexData: any, baseCurrency: string): any => {
  if (!Array.isArray(forexData)) return { average: 0, max: 0, min: 0 };

  const volatilities = forexData
    .filter((rate: any) => rate.ticker.includes(baseCurrency))
    .map((rate: any) => Math.abs(rate.changes || 0));

  return {
    average: average(volatilities),
    max: Math.max(...volatilities),
    min: Math.min(...volatilities)
  };
};

const calculateExposureLevel = (countries: string[]): string => {
  const uniqueRegions = new Set(countries.map(getRegionForCurrency));
  
  if (uniqueRegions.size > 3) return 'High';
  if (uniqueRegions.size > 1) return 'Medium';
  return 'Low';
};

const getRegionForCurrency = (country: string): string => {
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
};
