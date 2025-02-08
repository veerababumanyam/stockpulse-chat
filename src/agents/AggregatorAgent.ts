
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { OrchestratorAgent } from './OrchestratorAgent';

interface AggregatedRecommendation {
  symbol: string;
  companyName: string;
  recommendation: string;
  targetPrice: number;
  currentPrice: number;
  analyst: string;
  date: string;
  confidence: number;
  sources: string[];
  aiAnalysis: {
    summary: string;
    sentiment: string;
    riskLevel: string;
    technicalSignals: string[];
    fundamentalFactors: string[];
  };
}

export class AggregatorAgent extends BaseAgent {
  private static async aggregateRecommendations(scrapedData: any[]): Promise<AggregatedRecommendation[]> {
    const aggregated = new Map<string, AggregatedRecommendation>();
    
    for (const data of scrapedData) {
      if (!data.symbol) continue;
      
      const existing = aggregated.get(data.symbol);
      if (existing) {
        existing.sources.push(data.source);
        existing.confidence = (existing.confidence + data.confidence) / 2;
      } else {
        aggregated.set(data.symbol, {
          symbol: data.symbol,
          companyName: data.companyName,
          recommendation: data.recommendation,
          targetPrice: data.targetPrice,
          currentPrice: data.currentPrice,
          analyst: data.analyst,
          date: data.date,
          confidence: data.confidence,
          sources: [data.source],
          aiAnalysis: {
            summary: '',
            sentiment: '',
            riskLevel: '',
            technicalSignals: [],
            fundamentalFactors: []
          }
        });
      }
    }
    
    return Array.from(aggregated.values());
  }

  private static async enrichWithAIAnalysis(recommendations: AggregatedRecommendation[]): Promise<AggregatedRecommendation[]> {
    const enrichedRecommendations = [];
    
    for (const rec of recommendations) {
      try {
        const analysisResult = await OrchestratorAgent.orchestrateAnalysis({
          quote: { symbol: rec.symbol },
          profile: { companyName: rec.companyName }
        });

        if (typeof analysisResult === 'string') {
          console.error('Unexpected string result from orchestrateAnalysis');
          continue;
        }

        rec.aiAnalysis = {
          summary: analysisResult.fundamental?.analysis?.summary?.overview || '',
          sentiment: analysisResult.sentiment?.analysis?.currentSentiment || '',
          riskLevel: analysisResult.risk?.analysis?.riskLevel || '',
          technicalSignals: analysisResult.technical?.analysis?.signals || [],
          fundamentalFactors: analysisResult.fundamental?.analysis?.keyFactors || []
        };
        
        enrichedRecommendations.push(rec);
      } catch (error) {
        console.error(`Error analyzing ${rec.symbol}:`, error);
        enrichedRecommendations.push(rec);
      }
    }
    
    return enrichedRecommendations;
  }

  static async analyze(): Promise<AnalysisResult> {
    try {
      const scrapedData = await this.analyzeWithDeepseek(
        `Analyze recent stock recommendations from financial websites and extract key information. Include symbol, company name, recommendation type (buy/sell/hold), target price, current price, analyst name, and date.`
      );
      
      const parsedData = JSON.parse(scrapedData);
      const aggregatedRecommendations = await this.aggregateRecommendations(parsedData);
      const enrichedRecommendations = await this.enrichWithAIAnalysis(aggregatedRecommendations);
      
      const sortedRecommendations = enrichedRecommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10);
      
      return {
        type: 'aggregated-recommendations',
        analysis: {
          recommendations: sortedRecommendations,
          lastUpdated: new Date().toISOString(),
          totalSourcesAnalyzed: parsedData.length,
          averageConfidence: sortedRecommendations.reduce((acc, curr) => acc + curr.confidence, 0) / sortedRecommendations.length
        }
      };
    } catch (error) {
      console.error('Error in recommendation aggregation:', error);
      return {
        type: 'aggregated-recommendations',
        analysis: {
          recommendations: [],
          lastUpdated: new Date().toISOString(),
          totalSourcesAnalyzed: 0,
          averageConfidence: 0,
          error: 'Failed to aggregate recommendations'
        }
      };
    }
  }
}
