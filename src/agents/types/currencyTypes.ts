
export interface CurrencyExposure {
  primaryCurrencies: string[];
  exposureLevel: string;
  geographicBreakdown: Record<string, number>;
  volatilityMetrics: {
    average: number;
    max: number;
    min: number;
  };
}

export interface CurrencyRiskMetrics {
  volatilityRisk: string;
  correlationMatrix: Record<string, number>;
  valueAtRisk: string;
  diversificationScore: number;
}

export interface CurrencyAnalysis {
  summary: {
    overview: string;
    confidence: string;
    recommendation: string;
  };
  exposures: {
    primaryCurrencies: string[];
    exposureLevel: string;
    geographicBreakdown: Record<string, number>;
    volatilityMetrics: Record<string, number>;
    trends: string[];
    historicalComparison: Record<string, any>;
  };
  impact: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  risks: string[];
  opportunities: string[];
  hedgingStrategies: string[];
}
