
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class DataCleansingAgent extends BaseAgent {
  static async analyze(data: any): Promise<AnalysisResult> {
    try {
      const cleanedData = this.cleanData(data);
      return {
        type: 'data-cleansing',
        analysis: {
          dataQuality: this.assessDataQuality(cleanedData),
          cleanedFields: Object.keys(cleanedData),
          anomalies: this.detectAnomalies(cleanedData)
        }
      };
    } catch (error) {
      console.error('Error in data cleansing:', error);
      return {
        type: 'data-cleansing',
        analysis: {
          dataQuality: 'Unable to assess',
          cleanedFields: [],
          anomalies: []
        }
      };
    }
  }

  private static cleanData(data: any): any {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null || cleaned[key] === undefined) {
        cleaned[key] = 'N/A';
      }
    });
    return cleaned;
  }

  private static assessDataQuality(data: any): string {
    const totalFields = Object.keys(data).length;
    const validFields = Object.values(data).filter(v => v !== 'N/A').length;
    const quality = (validFields / totalFields) * 100;
    
    if (quality > 90) return 'Excellent';
    if (quality > 70) return 'Good';
    if (quality > 50) return 'Fair';
    return 'Poor';
  }

  private static detectAnomalies(data: any): string[] {
    const anomalies: string[] = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value === 'N/A') {
        anomalies.push(`Missing data for ${key}`);
      }
    });
    return anomalies;
  }
}
