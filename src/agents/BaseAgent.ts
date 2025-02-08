
import { DEEPSEEK_BASE_URL } from '@/utils/deepseekAPI';
import { APIClient } from '@/utils/APIClient';
import { calculatePercentageChange, calculateMovingAverage, calculateStandardDeviation, calculateCorrelation } from '@/utils/mathUtils';
import { getGeographicBreakdown } from '@/utils/geographicUtils';

export interface AnalysisResult {
  type: string;
  analysis: Record<string, any>;
}

export abstract class BaseAgent {
  private static apiClient = new APIClient();

  protected static async fetchData(url: string, apiKey: string): Promise<any> {
    return this.apiClient.fetchData(url, apiKey);
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

