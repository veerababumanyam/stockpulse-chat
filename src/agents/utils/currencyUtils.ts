
import { CurrencyExposure, CurrencyRiskMetrics } from '../types/currencyTypes';
import { getGeographicBreakdown } from '@/utils/geographicUtils';

export const identifyPrimaryCurrencies = (countries: string[]): string[] => {
  const currencyMap: Record<string, string> = {
    'United States': 'USD',
    'European Union': 'EUR',
    'United Kingdom': 'GBP',
    'Japan': 'JPY',
    'China': 'CNY',
    'Australia': 'AUD',
    'Canada': 'CAD',
    'Switzerland': 'CHF'
  };

  return Array.from(new Set(
    countries.map(country => currencyMap[country] || 'USD')
  ));
};

export const calculateExposureLevel = (countries: string[]): string => {
  const uniqueRegions = new Set(countries.map(getRegionForCurrency));
  
  if (uniqueRegions.size > 3) return 'High';
  if (uniqueRegions.size > 1) return 'Medium';
  return 'Low';
};

export const getRegionForCurrency = (country: string): string => {
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

export const calculateVolatilityMetrics = (forexData: any, baseCurrency: string): Record<string, number> => {
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

export const average = (numbers: number[]): number => {
  return numbers.length ? 
    numbers.reduce((a, b) => a + b, 0) / numbers.length : 
    0;
};

export const analyzeCurrencyExposures = (profile: any, forexData: any): CurrencyExposure => {
  const operatingCountries = profile?.operatingCountries || [];
  const mainCurrency = profile?.currency || 'USD';
  
  return {
    primaryCurrencies: identifyPrimaryCurrencies(operatingCountries),
    exposureLevel: calculateExposureLevel(operatingCountries),
    geographicBreakdown: getGeographicBreakdown(operatingCountries),
    volatilityMetrics: calculateVolatilityMetrics(forexData, mainCurrency)
  };
};
