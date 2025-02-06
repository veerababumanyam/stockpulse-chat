
import { DEEPSEEK_BASE_URL } from '@/utils/deepseekAPI';

export interface AnalysisResult {
  type: string;
  analysis: Record<string, any>;
}

export abstract class BaseAgent {
  protected static async fetchData(url: string, apiKey: string) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
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

