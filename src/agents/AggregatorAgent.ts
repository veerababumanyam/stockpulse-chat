
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
        // Update existing recommendation with new data
        existing.sources.push(data.source);
        existing.confidence = (existing.confidence + data.confidence) / 2;
      } else {
        // Create new recommendation
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
        const analysis = await OrchestratorAgent.orchestrateAnalysis({
          quote: { symbol: rec.symbol },
          profile: { companyName: rec.companyName }
        });
        
        // Enrich the recommendation with AI analysis
        rec.aiAnalysis = {
          summary: analysis.fundamental?.analysis?.summary?.overview || '',
          sentiment: analysis.sentiment?.analysis?.currentSentiment || '',
          riskLevel: analysis.risk?.analysis?.riskLevel || '',
          technicalSignals: analysis.technical?.analysis?.signals || [],
          fundamentalFactors: analysis.fundamental?.analysis?.keyFactors || []
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
      // Get recommendations from scraped data
      const scrapedData = await this.analyzeWithDeepseek(
        `Analyze recent stock recommendations from financial websites and extract key information. Include symbol, company name, recommendation type (buy/sell/hold), target price, current price, analyst name, and date.`
      );
      
      // Parse and aggregate recommendations
      const parsedData = JSON.parse(scrapedData);
      const aggregatedRecommendations = await this.aggregateRecommendations(parsedData);
      
      // Enrich with AI analysis
      const enrichedRecommendations = await this.enrichWithAIAnalysis(aggregatedRecommendations);
      
      // Sort by confidence and limit to top recommendations
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
