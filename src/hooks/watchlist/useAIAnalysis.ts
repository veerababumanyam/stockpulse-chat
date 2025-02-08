
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";

const AI_ANALYSIS_KEY = 'watchlist-ai-analysis';

export const loadAIAnalysis = () => {
  try {
    const savedAnalysis = localStorage.getItem(AI_ANALYSIS_KEY);
    if (savedAnalysis) {
      return JSON.parse(savedAnalysis);
    }
  } catch (err) {
    console.error('Error loading AI analysis:', err);
  }
  return {};
};

export const saveAIAnalysis = (analysis: Record<string, any>) => {
  try {
    localStorage.setItem(AI_ANALYSIS_KEY, JSON.stringify(analysis));
  } catch (err) {
    console.error('Error saving AI analysis:', err);
  }
};

export const runAIAnalysis = async (stockData: any) => {
  try {
    const analysisResults = await OrchestratorAgent.orchestrateAnalysis(stockData);
    
    const parsedResults = typeof analysisResults === 'string' 
      ? JSON.parse(analysisResults) 
      : analysisResults;

    if (!parsedResults?.results?.fundamental?.analysis) {
      console.log('No fundamental analysis results found:', parsedResults);
      return null;
    }
    
    const signal = parsedResults.results.fundamental.analysis.summary?.recommendation || 'HOLD';
    const targetPrice = parsedResults.results.fundamental.analysis.pricePredictions?.twelveMonths?.price || 0;
    const target24Price = parsedResults.results.fundamental.analysis.pricePredictions?.twentyFourMonths?.price || 0;
    
    return {
      signal,
      targetPrice,
      target24Price,
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error running AI analysis:', err);
    return null;
  }
};

export const shouldRunAnalysis = () => {
  const now = new Date();
  const marketOpen = new Date(now);
  marketOpen.setHours(9, 45, 0); // 15 minutes after market opens at 9:30
  const marketClose = new Date(now);
  marketClose.setHours(15, 45, 0); // 15 minutes before market closes at 16:00

  const isWeekday = now.getDay() > 0 && now.getDay() < 6;
  const isMarketHours = now >= marketOpen && now <= marketClose;

  return isWeekday && isMarketHours;
};
