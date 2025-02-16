import { DEEPSEEK_BASE_URL } from '@/utils/deepseekAPI';
import { APIClient } from '@/utils/APIClient';
import { calculatePercentageChange, calculateMovingAverage, calculateStandardDeviation, calculateCorrelation } from '@/utils/mathUtils';
import { getGeographicBreakdown } from '@/utils/geographicUtils';
import { fetchYahooStockData, fetchYahooQuotes } from '@/utils/yahooFinanceAPI';
import { validateFMPKey, handleFMPError } from '@/utils/validateFMPKey';

export interface AnalysisResult {
  type: string;
  analysis: Record<string, any>;
}

export abstract class BaseAgent {
  private static apiClient = new APIClient();

  protected static async fetchData(url: string, apiKey: string): Promise<any> {
    try {
      // Try FMP first
      validateFMPKey(apiKey);
      const response = await this.apiClient.fetchData(url, apiKey);
      await handleFMPError(response);
      return response.json();
    } catch (error) {
      console.log('FMP fetch failed, trying Yahoo Finance as backup:', error);
      
      // Extract symbol from URL if present
      const symbolMatch = url.match(/symbol=([^&]+)/);
      const symbol = symbolMatch ? symbolMatch[1] : null;
      
      if (symbol) {
        try {
          // Try Yahoo Finance as backup
          const yahooData = await fetchYahooStockData(symbol);
          return this.convertYahooToFMPFormat(yahooData);
        } catch (yahooError) {
          console.error('Both FMP and Yahoo Finance failed:', yahooError);
          throw new Error('Failed to fetch data from both FMP and Yahoo Finance');
        }
      } else {
        throw error; // Re-throw original error if we can't extract symbol
      }
    }
  }

  protected static async fetchCombinedData(symbol: string, apiKey: string): Promise<any> {
    try {
      // Fetch data from both sources in parallel
      const [fmpData, yahooData] = await Promise.allSettled([
        this.apiClient.fetchData(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`, apiKey)
          .then(res => handleFMPError(res))
          .then(res => res.json()),
        fetchYahooStockData(symbol)
      ]);

      // Combine the data if both succeeded
      if (fmpData.status === 'fulfilled' && yahooData.status === 'fulfilled') {
        return this.mergeMarketData(fmpData.value, yahooData.value);
      }
      
      // If FMP succeeded, use that
      if (fmpData.status === 'fulfilled') {
        return fmpData.value;
      }
      
      // If Yahoo succeeded, use that
      if (yahooData.status === 'fulfilled') {
        return this.convertYahooToFMPFormat(yahooData.value);
      }
      
      throw new Error('Failed to fetch data from both sources');
    } catch (error) {
      console.error('Error fetching combined data:', error);
      throw error;
    }
  }

  private static convertYahooToFMPFormat(yahooData: any): any {
    if (!yahooData?.chart?.result?.[0]) {
      throw new Error('Invalid Yahoo Finance data format');
    }

    const result = yahooData.chart.result[0];
    const quote = result.indicators.quote[0];
    const timestamp = result.timestamp[result.timestamp.length - 1];
    const price = quote.close[quote.close.length - 1];
    const prevClose = quote.close[quote.close.length - 2] || price;

    return {
      symbol: result.meta.symbol,
      price: price,
      change: price - prevClose,
      changesPercentage: ((price - prevClose) / prevClose) * 100,
      timestamp: timestamp * 1000
    };
  }

  private static mergeMarketData(fmpData: any, yahooData: any): any {
    // Use FMP data as base and supplement with Yahoo data
    const baseData = Array.isArray(fmpData) ? fmpData[0] : fmpData;
    const yahooQuote = yahooData.chart.result[0];
    
    return {
      ...baseData,
      yahoo: {
        timestamp: yahooQuote.timestamp[yahooQuote.timestamp.length - 1] * 1000,
        price: yahooQuote.indicators.quote[0].close.slice(-1)[0],
        volume: yahooQuote.indicators.quote[0].volume.slice(-1)[0]
      }
    };
  }

  protected static formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  protected static formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  protected static findLatestValue(data: any[], indicator: string): number {
    if (!Array.isArray(data)) return 0;
    
    const values = data
      .filter(item => item.indicator === indicator)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return values.length > 0 ? Number(values[0].value) : 0;
  }

  protected static calculateTrend(data: any[], indicator: string): number {
    if (!Array.isArray(data)) return 0;
    
    const values = data
      .filter(item => item.indicator === indicator)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => Number(item.value));
    
    if (values.length < 2) return 0;
    
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    
    return firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  }

  protected static determineEconomicCondition(data: any[]): string {
    const gdpTrend = this.calculateTrend(data, 'GDP');
    const inflationTrend = this.calculateTrend(data, 'CPI');
    const unemploymentRate = this.findLatestValue(data, 'UNEMPLOYMENT');

    if (gdpTrend > 2 && inflationTrend < 3 && unemploymentRate < 5) {
      return 'Strong Growth';
    } else if (gdpTrend > 0 && inflationTrend < 5 && unemploymentRate < 7) {
      return 'Moderate Growth';
    } else if (gdpTrend < 0 || inflationTrend > 5 || unemploymentRate > 7) {
      return 'Economic Challenges';
    }
    return 'Stable';
  }

  protected static async analyzeWithDeepseek(prompt: string): Promise<any> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { deepseek } = JSON.parse(savedKeys);
      
      if (!deepseek) {
        throw new Error('Deepseek API key not found');
      }

      const result = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseek}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [
            {
              role: 'system',
              content: 'You are a precise and analytical AI assistant specializing in financial analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      const data = await result.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error in Deepseek analysis:', error);
      throw error;
    }
  }
}
