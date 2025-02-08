
import { BaseAgent } from './BaseAgent';
import { ScrapingResult } from './news/types';
import { processNewsData } from './news/newsProcessing';
import { 
  extractRecommendationsFromData, 
  processAnalystRecommendations, 
  combineRecommendations 
} from './news/analystProcessing';

export class NewsScraperAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<ScrapingResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch both news and analyst recommendations from FMP API
      const [newsResponse, recommendationsResponse] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=100&apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/analyst-stock-recommendations/${symbol}?apikey=${fmp}`,
          fmp
        )
      ]);

      // Process news and extract recommendations
      const processedNews = processNewsData(newsResponse);
      const recommendedStocks = processedNews.map(news => news.symbols || []).flat();
      const analystRecommendations = processAnalystRecommendations(recommendationsResponse, symbol);

      // Combine recommendations from news and analyst data
      const combinedRecommendations = combineRecommendations(
        analystRecommendations,
        recommendedStocks
      );

      return {
        success: true,
        analysis: {
          recentNews: processedNews,
          sources: [...new Set(processedNews.map(news => news.source))],
          recommendedStocks: [...new Set(combinedRecommendations)],
          analystRecommendations: [{
            symbol,
            recommendations: extractRecommendationsFromData(recommendationsResponse)
          }]
        }
      };
    } catch (error) {
      console.error('Error in news scraping:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape news'
      };
    }
  }
}

