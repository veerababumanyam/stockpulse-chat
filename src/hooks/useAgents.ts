
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  active: boolean;
}

const STORAGE_KEY = 'ai-agents-config';

// Generate agent ID from class name
const generateAgentId = (className: string) => {
  return className.replace(/Agent$/, "").replace(/([A-Z])/g, "-$1").toLowerCase().slice(1);
};

// Generate agent name from class name
const generateAgentName = (className: string) => {
  return className.replace(/Agent$/, "").replace(/([A-Z])/g, " $1").trim();
};

// Generate description based on name
const generateDescription = (name: string) => {
  return `${name} specializing in ${name.toLowerCase()} analysis and insights`;
};

// Extract agent names from OrchestratorAgent.ts imports
const agentClassNames = [
  "FundamentalAnalysis",
  "TechnicalAnalysis",
  "NewsAnalysis",
  "AnalystRecommendations",
  "MarketSentiment",
  "RiskAssessment",
  "MacroeconomicAnalysis",
  "DataCleansing",
  "CompetitiveAnalysis",
  "ESGAnalysis",
  "TechnicalData",
  "MarketResearch",
  "DataIntegration",
  "ValuationAnalysis",
  "CashFlowAnalysis",
  "VolatilityAnalysis",
  "GrowthTrendAnalysis",
  "DividendAnalysis",
  "NewsScraper",
  "FinancialStatement",
  "ETFFlow",
  "LegalDocument",
  "PatentAnalysis",
  "BigPlayerTracking",
  "AnomalyDetection",
  "CorrelationAnalysis",
  "SectorRotation",
  "MarketBreadth",
  "TrendAnalysis",
  "MomentumAnalysis",
  "TechnicalDepth",
  "FundamentalForensic",
  "SentimentSynthesizer",
  "MachineLearning",
  "NLP",
  "TimeSeriesForecaster",
  "ScenarioAnalysis",
  "DeepLearning",
  "ReinforcementLearning",
  "EnsembleModeling",
  "BayesianInference",
  "InvestmentTrend",
  "LegalImpact",
  "PatentValue",
  "SupplyDemand",
  "GeopoliticalImpact",
  "CurrencyImpact",
  "CommodityImpact",
  "TechnologicalDisruption",
  "DemographicTrend",
  "AlternativeDataAnalysis",
  "SeasonalityAnalysis",
  "LiquidityAnalysis",
  "OptionsMarketAnalysis",
  "RegulatoryCompliance",
  "InsiderTrading"
];

const defaultAgents: AgentConfig[] = agentClassNames.map(className => ({
  id: generateAgentId(className),
  name: generateAgentName(className),
  description: generateDescription(generateAgentName(className)),
  model: "gpt-4o-mini",
  temperature: 0.3 + (Math.random() * 0.2), // Random temperature between 0.3 and 0.5
  systemPrompt: `You are a ${generateAgentName(className).toLowerCase()} expert. Analyze and provide insights in your domain.`,
  active: true
}));

export const useAgents = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedAgents = localStorage.getItem(STORAGE_KEY);
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    } else {
      setAgents(defaultAgents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAgents));
    }
  }, []);

  const handleSaveAgent = (config: AgentConfig) => {
    setAgents(prev => {
      const newAgents = config.id && prev.find(a => a.id === config.id)
        ? prev.map(a => a.id === config.id ? config : a)
        : [...prev, { ...config, id: crypto.randomUUID() }];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));
      return newAgents;
    });
    
    toast({
      title: "Success",
      description: `Agent ${config.name} has been ${config.id ? "updated" : "created"} successfully.`,
    });
  };

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev => {
      const newAgents = prev.map(agent =>
        agent.id === agentId
          ? { ...agent, active: !agent.active }
          : agent
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));
      return newAgents;
    });
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(prev => {
      const newAgents = prev.filter(agent => agent.id !== agentId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));
      return newAgents;
    });
    
    toast({
      title: "Agent Deleted",
      description: "The agent has been removed successfully.",
    });
  };

  return {
    agents,
    handleSaveAgent,
    handleToggleAgent,
    handleDeleteAgent
  };
};

export type { AgentConfig };
