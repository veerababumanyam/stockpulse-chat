import { BaseAgent, AnalysisResult } from './BaseAgent';

interface ScrapedNews {
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

interface ScrapingResult {
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
    'tradingview.com',
    'tipranks.com',
    'zacks.com',
    'morningstar.com',
    'barrons.com',
    'bloomberg.com'
  ];

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
      const processedNews = this.processNewsData(newsResponse);
      const recommendedStocks = this.extractStockSymbols(processedNews);
      const analystRecommendations = this.processAnalystRecommendations(recommendationsResponse, symbol);

      // Combine recommendations from news and analyst data
      const combinedRecommendations = this.combineRecommendations(
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
            recommendations: this.extractRecommendationsFromData(recommendationsResponse)
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
        symbols: this.extractSymbolsFromNews(item),
        recommendation: this.extractRecommendationFromText(item.title + ' ' + item.text)
      }));
  }

  private static extractRecommendationFromText(text: string): string | undefined {
    const buyKeywords = ['buy', 'bullish', 'upgrade', 'outperform'];
    const sellKeywords = ['sell', 'bearish', 'downgrade', 'underperform'];
    const holdKeywords = ['hold', 'neutral', 'market perform'];

    text = text.toLowerCase();

    if (buyKeywords.some(keyword => text.includes(keyword))) return 'BUY';
    if (sellKeywords.some(keyword => text.includes(keyword))) return 'SELL';
    if (holdKeywords.some(keyword => text.includes(keyword))) return 'HOLD';
    return undefined;
  }

  private static extractRecommendationsFromData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map(item => ({
      analyst: item.analystName || 'Unknown Analyst',
      source: item.site || 'Financial Institution',
      recommendation: item.recommendation || 'N/A',
      targetPrice: item.targetPrice,
      date: this.formatDate(item.date)
    }));
  }

  private static processAnalystRecommendations(recommendations: any[], symbol: string): string[] {
    if (!Array.isArray(recommendations)) return [];

    const recommendedStocks = new Set<string>([symbol]);
    recommendations.forEach(rec => {
      if (rec.recommendation?.toLowerCase().includes('buy')) {
        recommendedStocks.add(symbol);
      }
    });

    return Array.from(recommendedStocks);
  }

  private static combineRecommendations(analystRecs: string[], newsRecs: string[]): string[] {
    const allRecs = new Set([...analystRecs, ...newsRecs]);
    return Array.from(allRecs);
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
