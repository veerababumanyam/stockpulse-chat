import { DEEPSEEK_BASE_URL } from '@/utils/deepseekAPI';

export interface AnalysisResult {
  type: string;
  analysis: Record<string, any>;
}

export abstract class BaseAgent {
  private static retryDelay = 2000; // 2 seconds
  private static maxRetries = 5;
  private static requestQueue: Promise<any> = Promise.resolve();
  private static rateLimitWindow = 60000; // 1 minute
  private static requestCount = 0;
  private static lastRequestTime = Date.now();
  private static maxRequestsPerMinute = 1; // Even more restrictive limit
  private static pendingRequests: Set<string> = new Set();
  private static waitingTime = 0;
  private static globalTimeout: NodeJS.Timeout | null = null;

  protected static async fetchData(url: string, apiKey: string, retryCount = 0): Promise<any> {
    const requestId = url;

    // Check if this exact request is already pending
    if (this.pendingRequests.has(requestId)) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s before retry
      return this.fetchData(url, apiKey, retryCount);
    }

    // Add to pending requests
    this.pendingRequests.add(requestId);

    try {
      // Calculate time since last request
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;

      // Reset counter if window has passed
      if (timeSinceLastRequest > this.rateLimitWindow) {
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
        this.waitingTime = 0;
      }

      // Calculate base waiting time for rate limiting
      let baseWaitTime = 0;
      if (this.requestCount >= this.maxRequestsPerMinute) {
        baseWaitTime = Math.max(
          this.rateLimitWindow - timeSinceLastRequest + this.waitingTime,
          this.retryDelay * Math.pow(2, retryCount)
        );
      }

      // Add additional delay between requests even if under rate limit
      const minRequestInterval = 3000; // Minimum 3 seconds between requests
      const requestInterval = Math.max(minRequestInterval, baseWaitTime);

      if (requestInterval > 0) {
        console.log(`Waiting ${requestInterval}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, requestInterval));
      }

      // Queue the request
      return await new Promise((resolve, reject) => {
        this.requestQueue = this.requestQueue
          .then(async () => {
            try {
              // Clear any existing global timeout
              if (this.globalTimeout) {
                clearTimeout(this.globalTimeout);
              }

              // Increment before making request
              this.requestCount++;
              this.lastRequestTime = Date.now();

              const response = await fetch(url);
              
              if (response.status === 429) {
                const backoffTime = this.retryDelay * Math.pow(2, retryCount);
                console.log(`Rate limit hit, attempt ${retryCount + 1} of ${this.maxRetries}, waiting ${backoffTime}ms`);
                
                if (retryCount < this.maxRetries) {
                  this.waitingTime += backoffTime;
                  
                  // Set a global timeout to pause all requests
                  await new Promise((resolve) => {
                    this.globalTimeout = setTimeout(resolve, backoffTime);
                  });
                  
                  this.pendingRequests.delete(requestId);
                  return this.fetchData(url, apiKey, retryCount + 1);
                } else {
                  throw new Error('API rate limit reached. Please try again later.');
                }
              }

              if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
              }

              const data = await response.json();
              resolve(data);
              return data;
            } catch (error: any) {
              console.error('Error in fetchData:', error);
              reject(new Error(error.message || 'Failed to fetch data'));
            } finally {
              this.pendingRequests.delete(requestId);
            }
          })
          .catch(error => {
            this.pendingRequests.delete(requestId);
            reject(error);
          });
      });
    } catch (error) {
      this.pendingRequests.delete(requestId);
      throw error;
    }
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

  protected static getGeographicBreakdown(countries: string[]): Record<string, number> {
    const regions: Record<string, number> = {};
    countries.forEach(country => {
      const region = this.getRegion(country);
      regions[region] = (regions[region] || 0) + 1;
    });
    return regions;
  }

  private static getRegion(country: string): string {
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
  }

  protected static async analyzeWithDeepseek(prompt: string): Promise<string> {
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

  protected static calculatePercentageChange(current: number, previous: number): number {
    return previous !== 0 ? ((current - previous) / previous) * 100 : 0;
  }

  protected static calculateMovingAverage(data: number[], period: number): number {
    if (data.length < period) return 0;
    const sum = data.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  protected static calculateStandardDeviation(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squareDiffs = data.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  protected static calculateCorrelation(data1: number[], data2: number[]): number {
    if (data1.length !== data2.length || data1.length === 0) return 0;

    const mean1 = data1.reduce((a, b) => a + b, 0) / data1.length;
    const mean2 = data2.reduce((a, b) => a + b, 0) / data2.length;

    const diffProd = data1.map((val, i) => (val - mean1) * (data2[i] - mean2));
    const squareDiff1 = data1.map(val => Math.pow(val - mean1, 2));
    const squareDiff2 = data2.map(val => Math.pow(val - mean2, 2));

    const sum = diffProd.reduce((a, b) => a + b, 0);
    const standardDeviations = Math.sqrt(
      squareDiff1.reduce((a, b) => a + b, 0) * 
      squareDiff2.reduce((a, b) => a + b, 0)
    );

    return standardDeviations === 0 ? 0 : sum / standardDeviations;
  }
}
