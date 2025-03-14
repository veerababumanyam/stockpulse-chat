
import { type ScreeningCriteria, type AgentScreeningResponse } from "@/components/screener/types";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { FundamentalAnalysisAgent } from "@/agents/FundamentalAnalysisAgent";
import { TechnicalAnalysisAgent } from "@/agents/TechnicalAnalysisAgent";
import { MarketSentimentAgent } from "@/agents/MarketSentimentAgent";

export async function generateScreeningCriteria(query: string): Promise<ScreeningCriteria[]> {
  try {
    const savedKeys = localStorage.getItem('apiKeys');
    if (!savedKeys) {
      throw new Error('API keys not found. Please set up your API keys in the settings.');
    }

    const { fmp } = JSON.parse(savedKeys);
    if (!fmp) {
      throw new Error('FMP API key not found. Please add your Financial Modeling Prep API key in settings.');
    }

    // Initialize required agents with analyze method and type conversion
    const fundamentalAgent = {
      analyze: async (data: any) => {
        const result = await FundamentalAnalysisAgent.analyze(data);
        return {
          screening: result.analysis.screening || []
        } as AgentScreeningResponse;
      }
    };

    const technicalAgent = {
      analyze: async (data: any) => {
        const result = await TechnicalAnalysisAgent.analyze(data);
        return {
          screening: result.analysis.screening || []
        } as AgentScreeningResponse;
      }
    };

    const sentimentAgent = {
      analyze: async (data: any) => {
        const result = await MarketSentimentAgent.analyze(data);
        return {
          screening: result.analysis.screening || []
        } as AgentScreeningResponse;
      }
    };

    // Register agents with orchestrator
    OrchestratorAgent.registerAgent('fundamental', fundamentalAgent);
    OrchestratorAgent.registerAgent('technical', technicalAgent);
    OrchestratorAgent.registerAgent('sentiment', sentimentAgent);

    console.log('Processing query with AI agents:', query);

    // Get analysis from each agent
    const fundamentalAnalysis = await fundamentalAgent.analyze({
      query,
      type: 'screening',
      context: { fmpKey: fmp }
    });

    const technicalAnalysis = await technicalAgent.analyze({
      query,
      type: 'screening',
      context: { fmpKey: fmp }
    });

    const sentimentAnalysis = await sentimentAgent.analyze({
      query,
      type: 'screening',
      context: { fmpKey: fmp }
    });

    // Combine and process criteria from all agents
    const criteria: ScreeningCriteria[] = [
      ...processCriteria(fundamentalAnalysis?.screening || []),
      ...processCriteria(technicalAnalysis?.screening || []),
      ...processCriteria(sentimentAnalysis?.screening || [])
    ];

    // Add default criteria if none provided
    if (criteria.length === 0) {
      criteria.push({
        metric: 'marketCap',
        operator: 'greater',
        value: 100000000 // Basic minimum market cap filter
      });
      criteria.push({
        metric: 'volume',
        operator: 'greater',
        value: 10000 // Basic minimum volume filter
      });
    }

    console.log('Generated screening criteria from AI agents:', criteria);
    return criteria;
  } catch (error) {
    console.error('Error generating criteria with AI agents:', error);
    throw error;
  }
}

function processCriteria(agentCriteria: any[]): ScreeningCriteria[] {
  return agentCriteria
    .filter(criterion => criterion && criterion.metric && criterion.operator && criterion.value)
    .map(criterion => ({
      metric: criterion.metric,
      operator: criterion.operator as 'greater' | 'less' | 'equal' | 'between',
      value: criterion.value
    }));
}
