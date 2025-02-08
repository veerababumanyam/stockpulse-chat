
export interface ScrapedNews {
  title: string;
  url: string;
  source: string;
  summary: string;
  date: string;
  symbols?: string[];
  recommendation?: string;
  analystName?: string;
  targetPrice?: number;
}

export interface ScrapingResult {
  success: boolean;
  analysis?: {
    recentNews: ScrapedNews[];
    sources: string[];
    recommendedStocks: string[];
    analystRecommendations: {
      symbol: string;
      recommendations: {
        analyst: string;
        source: string;
        recommendation: string;
        targetPrice?: number;
        date: string;
      }[];
    }[];
  };
  error?: string;
}

