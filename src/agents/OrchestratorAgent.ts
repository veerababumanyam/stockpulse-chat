import { FundamentalAnalysisAgent } from './FundamentalAnalysisAgent';
import { TechnicalAnalysisAgent } from './TechnicalAnalysisAgent';
import { NewsAnalysisAgent } from './NewsAnalysisAgent';
import { AnalystRecommendationsAgent } from './AnalystRecommendationsAgent';
import { MarketSentimentAgent } from './MarketSentimentAgent';
import { RiskAssessmentAgent } from './RiskAssessmentAgent';
import { MacroeconomicAnalysisAgent } from './MacroeconomicAnalysisAgent';
import { DataCleansingAgent } from './DataCleansingAgent';
import { CompetitiveAnalysisAgent } from './CompetitiveAnalysisAgent';
import { ESGAnalysisAgent } from './ESGAnalysisAgent';
import { TechnicalDataAgent } from './TechnicalDataAgent';
import { MarketResearchAgent } from './MarketResearchAgent';
import { DataIntegrationAgent } from './DataIntegrationAgent';
import { ValuationAnalysisAgent } from './ValuationAnalysisAgent';
import { CashFlowAnalysisAgent } from './CashFlowAnalysisAgent';
import { VolatilityAnalysisAgent } from './VolatilityAnalysisAgent';
import { GrowthTrendAnalysisAgent } from './GrowthTrendAnalysisAgent';
import { DividendAnalysisAgent } from './DividendAnalysisAgent';
import { NewsScraperAgent } from './NewsScraperAgent';
import { FinancialStatementAgent } from './FinancialStatementAgent';
import { ETFFlowAgent } from './ETFFlowAgent';
import { LegalDocumentAgent } from './LegalDocumentAgent';
import { PatentAnalysisAgent } from './PatentAnalysisAgent';
import { BigPlayerTrackingAgent } from './BigPlayerTrackingAgent';
import { AnomalyDetectionAgent } from './AnomalyDetectionAgent';
import { CorrelationAnalysisAgent } from './CorrelationAnalysisAgent';
import { SectorRotationAgent } from './SectorRotationAgent';
import { MarketBreadthAgent } from './MarketBreadthAgent';
import { TrendAnalysisAgent } from './TrendAnalysisAgent';
import { MomentumAnalysisAgent } from './MomentumAnalysisAgent';
import { TechnicalDepthAgent } from './TechnicalDepthAgent';
import { FundamentalForensicAgent } from './FundamentalForensicAgent';
import { SentimentSynthesizerAgent } from './SentimentSynthesizerAgent';
import { MachineLearningAgent } from './MachineLearningAgent';
import { NLPAgent } from './NLPAgent';
import { TimeSeriesForecasterAgent } from './TimeSeriesForecasterAgent';
import { ScenarioAnalysisAgent } from './ScenarioAnalysisAgent';
import { DeepLearningAgent } from './DeepLearningAgent';
import { ReinforcementLearningAgent } from './ReinforcementLearningAgent';
import { EnsembleModelingAgent } from './EnsembleModelingAgent';
import { BayesianInferenceAgent } from './BayesianInferenceAgent';
import { InvestmentTrendAgent } from './InvestmentTrendAgent';
import { LegalImpactAgent } from './LegalImpactAgent';
import { PatentValueAgent } from './PatentValueAgent';
import { SupplyDemandAgent } from './SupplyDemandAgent';
import { GeopoliticalImpactAgent } from './GeopoliticalImpactAgent';
import { CurrencyImpactAgent } from './CurrencyImpactAgent';
import { CommodityImpactAgent } from './CommodityImpactAgent';
import { TechnologicalDisruptionAgent } from './TechnologicalDisruptionAgent';
import { DemographicTrendAgent } from './DemographicTrendAgent';
import { AgentResult, AgentResults } from './types/AgentTypes';
import { OutputFormatter } from './utils/OutputFormatter';

export class OrchestratorAgent {
  private static results: AgentResults = new Map();

  private static async executeAgent(name: string, agentFn: () => Promise<any>): Promise<void> {
    try {
      const result = await agentFn();
      this.results.set(name, { data: result });
    } catch (error: any) {
      console.error(`Error in ${name} agent:`, error);
      this.results.set(name, { 
        data: null, 
        error: `${name} analysis failed: ${error.message}` 
      });
    }
  }

  static async orchestrateAnalysis(stockData: any) {
    this.results.clear();

    try {
      const agentPromises = [
        this.executeAgent('fundamental', () => FundamentalAnalysisAgent.analyze(stockData)),
        this.executeAgent('technical', () => TechnicalAnalysisAgent.analyze(stockData)),
        this.executeAgent('news', () => NewsAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('analyst', () => AnalystRecommendationsAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('sentiment', () => MarketSentimentAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('risk', () => RiskAssessmentAgent.analyze(stockData)),
        this.executeAgent('macro', () => MacroeconomicAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('dataQuality', () => DataCleansingAgent.analyze(stockData)),
        this.executeAgent('competitive', () => CompetitiveAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('esg', () => ESGAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('technicalData', () => TechnicalDataAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('marketResearch', () => MarketResearchAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('dataIntegration', () => DataIntegrationAgent.analyze(stockData)),
        this.executeAgent('valuation', () => ValuationAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('cashFlow', () => CashFlowAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('volatility', () => VolatilityAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('growthTrends', () => GrowthTrendAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('dividend', () => DividendAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('newsScraper', () => NewsScraperAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('financialStatement', () => FinancialStatementAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('etfFlow', () => ETFFlowAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('legalDocument', () => LegalDocumentAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('patentAnalysis', () => PatentAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('bigPlayerTracking', () => BigPlayerTrackingAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('anomalyDetection', () => AnomalyDetectionAgent.analyze(stockData)),
        this.executeAgent('correlationAnalysis', () => CorrelationAnalysisAgent.analyze(stockData)),
        this.executeAgent('sectorRotation', () => SectorRotationAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('marketBreadth', () => MarketBreadthAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('trendAnalysis', () => TrendAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('momentumAnalysis', () => MomentumAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('technicalDepth', () => TechnicalDepthAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('fundamentalForensic', () => FundamentalForensicAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('sentimentSynthesizer', () => SentimentSynthesizerAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('machineLearning', () => MachineLearningAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('nlp', () => NLPAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('timeSeries', () => TimeSeriesForecasterAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('scenario', () => ScenarioAnalysisAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('deepLearning', () => DeepLearningAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('reinforcementLearning', () => ReinforcementLearningAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('ensembleModeling', () => EnsembleModelingAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('bayesianInference', () => BayesianInferenceAgent.analyze(stockData.quote.symbol)),
        
        // Add new specialized analysis agents
        this.executeAgent('investmentTrend', () => InvestmentTrendAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('legalImpact', () => LegalImpactAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('patentValue', () => PatentValueAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('supplyDemand', () => SupplyDemandAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('geopoliticalImpact', () => GeopoliticalImpactAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('currencyImpact', () => CurrencyImpactAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('commodityImpact', () => CommodityImpactAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('technologicalDisruption', () => TechnologicalDisruptionAgent.analyze(stockData.quote.symbol)),
        this.executeAgent('demographicTrend', () => DemographicTrendAgent.analyze(stockData.quote.symbol))
      ];

      await Promise.all(agentPromises);

      return this.formatOutput({
        symbol: stockData.quote.symbol,
        companyName: stockData.profile.companyName,
        results: Object.fromEntries(this.results)
      });
    } catch (error) {
      console.error('Error in orchestration:', error);
      throw new Error('Error analyzing stock data. Please try again.');
    }
  }

  private static formatOutput(data: any): string {
    return OutputFormatter.formatOutput(data);
  }
}
