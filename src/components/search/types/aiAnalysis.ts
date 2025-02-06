
export interface PriceProjections {
  threeMonths: number;
  sixMonths: number;
  twelveMonths: number;
  twentyFourMonths: number;
}

export interface AIAnalysis {
  textOutput: string;
  formattedData: {
    symbol: string;
    companyName: string;
    recommendation: string;
    confidenceScore: number;
    priceProjections: PriceProjections;
    results: Record<string, any>;
  };
}

export interface AIAnalysisTabProps {
  aiAnalysis: AIAnalysis | null;
  isLoading: boolean;
}
