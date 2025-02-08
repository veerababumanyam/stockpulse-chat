
import { ApiKeys } from './llm';

export interface Message {
  content: string;
  isUser: boolean;
  data?: any;
}

export { ApiKeys };

export interface AnalysisResult {
  textOutput: string;
  formattedData: {
    symbol: string;
    companyName: string;
    recommendation: string;
    confidenceScore: number;
    priceProjections: {
      threeMonths: number;
      sixMonths: number;
      twelveMonths: number;
      twentyFourMonths: number;
    };
    results: Record<string, any>;
  };
}
