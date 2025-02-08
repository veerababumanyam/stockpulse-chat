
import { BaseAgent, AnalysisResult } from './BaseAgent';

interface ScrapedNews {
  title: string;
  url: string;
  source: string;
  summary: string;
  date: string;
  symbols?: string[];
}

interface ScrapingResult {
  success: boolean;
  analysis?: {
    recentNews: ScrapedNews[];
    sources: string[];
    recommendedStocks: string[];
  };
  error?: string;
}

export class NewsScraperAgent extends BaseAgent {
  private static readonly FINANCIAL_SOURCES = [
    'seekingalpha.com',
    'marketbeat.com',
    'thestreet.com',
    'fool.com',
    'cnbc.com',
    'reuters.com',
    'wsj.com',
    'investors.com',
    'marketwatch.com',
    'nasdaq.com',
    'finance.yahoo.com',
    'google.com/finance',
    'investing.com',
    'tradingview.com'
  ];

  static async analyze(symbol: string): Promise<ScrapingResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch news from FMP API for the given symbol
      const newsResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=100&apikey=${fmp}`,
        fmp
      );

      // Process and filter news by trusted sources
      const processedNews = this.processNewsData(newsResponse);
      const recommendedStocks = this.extractStockSymbols(processedNews);

      return {
        success: true,
        analysis: {
          recentNews: processedNews,
          sources: [...new Set(processedNews.map(news => news.source))],
          recommendedStocks: [...new Set(recommendedStocks)]
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

  private static processNewsData(news: any[]): ScrapedNews[] {
    if (!Array.isArray(news)) return [];
    
    return news
      .filter(item => this.FINANCIAL_SOURCES.some(source => 
        item.site?.toLowerCase().includes(source)
      ))
      .map(item => ({
        title: item.title,
        url: item.url,
        source: item.site,
        summary: item.text?.substring(0, 200) + '...',
        date: this.formatDate(item.publishedDate),
        symbols: this.extractSymbolsFromNews(item)
      }));
  }

  private static extractStockSymbols(news: ScrapedNews[]): string[] {
    const symbols: Set<string> = new Set();
    
    news.forEach(item => {
      const content = `${item.title} ${item.summary}`.toUpperCase();
      
      // Look for common patterns like "TICKER:" or "$TICKER"
      const matches = content.match(/\$[A-Z]{1,5}|[A-Z]{1,5}:|[A-Z]{1,5}\s(?=is|has|was|reported)/g) || [];
      
      matches.forEach(match => {
        const symbol = match.replace(/[$:\s]/g, '');
        if (symbol.length >= 2 && symbol.length <= 5 && !this.isCommonWord(symbol)) {
          symbols.add(symbol);
        }
      });
    });
    
    return Array.from(symbols);
  }

  private static extractSymbolsFromNews(news: any): string[] {
    const symbols: string[] = [];
    const content = (news.title + ' ' + news.text).toUpperCase();
    
    // Look for common patterns
    const matches = content.match(/\$[A-Z]{1,5}|[A-Z]{1,5}:|[A-Z]{1,5}\s(?=is|has|was|reported)/g) || [];
    
    matches.forEach(match => {
      const symbol = match.replace(/[$:\s]/g, '');
      if (symbol.length >= 2 && symbol.length <= 5 && !this.isCommonWord(symbol)) {
        symbols.push(symbol);
      }
    });
    
    return [...new Set(symbols)];
  }

  private static isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'THE', 'AND', 'FOR', 'NEW', 'NOW', 'HOW', 'WHY', 'WHO', 'WHAT', 'WHEN',
      'CEO', 'CFO', 'IPO', 'USA', 'FDA', 'SEC', 'ETF', 'GDP'
    ]);
    return commonWords.has(word);
  }
}
