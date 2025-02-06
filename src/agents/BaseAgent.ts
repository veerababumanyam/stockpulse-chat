
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
}
