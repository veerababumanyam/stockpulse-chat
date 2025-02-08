
import { type ScreeningCriteria } from "@/components/screener/types";
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

    // Initialize required agents
    const fundamentalAgent = new FundamentalAnalysisAgent();
    const technicalAgent = new TechnicalAnalysisAgent();
    const sentimentAgent = new MarketSentimentAgent();

    // Register agents with orchestrator
    OrchestratorAgent.registerAgent('fundamental', fundamentalAgent);
    OrchestratorAgent.registerAgent('technical', technicalAgent);
    OrchestratorAgent.registerAgent('sentiment', sentimentAgent);

    console.log('Processing query with AI agents:', query);

    // Get analysis from each agent
    const fundamentalCriteria = await OrchestratorAgent.executeAgent('fundamental', {
      query,
      type: 'screening',
      context: { fmpKey: fmp }
    });

    const technicalCriteria = await OrchestratorAgent.executeAgent('technical', {
      query,
      type: 'screening',
      context: { fmpKey: fmp }
    });

    const sentimentCriteria = await OrchestratorAgent.executeAgent('sentiment', {
      query,
      type: 'screening',
      context: { fmpKey: fmp }
    });

    // Combine and process criteria from all agents
    const criteria: ScreeningCriteria[] = [
      ...processCriteria(fundamentalCriteria?.screening || []),
      ...processCriteria(technicalCriteria?.screening || []),
      ...processCriteria(sentimentCriteria?.screening || [])
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
