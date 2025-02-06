import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentConfigDialog } from "@/components/agents/AgentConfigDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

const defaultAgents: AgentConfig[] = [
  {
    id: "tech-analysis",
    name: "Technical Analysis Agent",
    description: "Analyzes technical indicators and market patterns",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a technical analysis expert. Analyze market patterns and provide insights.",
    active: true
  },
  {
    id: "sentiment",
    name: "Sentiment Analysis Agent",
    description: "Analyzes market sentiment from various sources",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a sentiment analysis expert. Analyze market sentiment and provide insights.",
    active: true
  },
  {
    id: "anomaly-detection",
    name: "Anomaly Detection Agent",
    description: "Detects unusual patterns and market anomalies",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are an anomaly detection expert. Identify unusual patterns in market data.",
    active: true
  },
  {
    id: "bayesian-inference",
    name: "Bayesian Inference Agent",
    description: "Applies Bayesian analysis to market predictions",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a Bayesian analysis expert. Apply probabilistic reasoning to market data.",
    active: true
  },
  {
    id: "big-player-tracking",
    name: "Big Player Tracking Agent",
    description: "Tracks institutional investor movements",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are an institutional investor tracking expert. Monitor large market movements.",
    active: true
  },
  {
    id: "commodity-impact",
    name: "Commodity Impact Agent",
    description: "Analyzes commodity price impacts on markets",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a commodity market expert. Analyze commodity price impacts.",
    active: true
  },
  {
    id: "competitive-analysis",
    name: "Competitive Analysis Agent",
    description: "Analyzes competitive landscape and market positioning",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a competitive analysis expert. Evaluate market positioning.",
    active: true
  },
  {
    id: "correlation-analysis",
    name: "Correlation Analysis Agent",
    description: "Identifies correlations between different assets",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a correlation analysis expert. Identify relationships between assets.",
    active: true
  },
  {
    id: "currency-exchange",
    name: "Currency Exchange Agent",
    description: "Analyzes currency exchange impacts",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a currency exchange expert. Analyze forex market impacts.",
    active: true
  },
  {
    id: "data-cleansing",
    name: "Data Cleansing Agent",
    description: "Cleanses and validates market data",
    model: "gpt-4o-mini",
    temperature: 0.2,
    systemPrompt: "You are a data cleansing expert. Clean and validate market data.",
    active: true
  },
  {
    id: "volatility-analysis",
    name: "Volatility Analysis Agent",
    description: "Analyzes market volatility patterns",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a volatility analysis expert. Analyze market volatility patterns.",
    active: true
  },
  {
    id: "fundamental-analysis",
    name: "Fundamental Analysis Agent",
    description: "Analyzes company fundamentals and financial metrics",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a fundamental analysis expert. Analyze company financials and metrics.",
    active: true
  },
  {
    id: "news-analysis",
    name: "News Analysis Agent",
    description: "Analyzes market news and their potential impact",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a news analysis expert. Analyze market news and their implications.",
    active: true
  },
  {
    id: "analyst-recommendations",
    name: "Analyst Recommendations Agent",
    description: "Aggregates and analyzes analyst recommendations",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are an analyst recommendations expert. Analyze market recommendations.",
    active: true
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment Agent",
    description: "Evaluates market and investment risks",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a risk assessment expert. Evaluate investment risks.",
    active: true
  },
  {
    id: "macroeconomic",
    name: "Macroeconomic Analysis Agent",
    description: "Analyzes macroeconomic factors and their market impact",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a macroeconomic analysis expert. Analyze economic indicators.",
    active: true
  },
  {
    id: "esg-analysis",
    name: "ESG Analysis Agent",
    description: "Analyzes environmental, social, and governance factors",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are an ESG analysis expert. Evaluate sustainability metrics.",
    active: true
  },
  {
    id: "market-research",
    name: "Market Research Agent",
    description: "Conducts comprehensive market research",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a market research expert. Analyze market trends and patterns.",
    active: true
  },
  {
    id: "valuation",
    name: "Valuation Analysis Agent",
    description: "Performs company valuation analysis",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a valuation expert. Calculate and analyze company valuations.",
    active: true
  },
  {
    id: "cash-flow",
    name: "Cash Flow Analysis Agent",
    description: "Analyzes company cash flows and financial health",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a cash flow analysis expert. Evaluate financial health.",
    active: true
  },
  {
    id: "growth-trends",
    name: "Growth Trend Analysis Agent",
    description: "Analyzes company and market growth trends",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a growth analysis expert. Identify growth patterns.",
    active: true
  },
  {
    id: "dividend",
    name: "Dividend Analysis Agent",
    description: "Analyzes dividend policies and sustainability",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a dividend analysis expert. Evaluate dividend strategies.",
    active: true
  },
  {
    id: "financial-statement",
    name: "Financial Statement Agent",
    description: "Analyzes company financial statements",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a financial statement expert. Analyze company financials.",
    active: true
  },
  {
    id: "etf-flow",
    name: "ETF Flow Agent",
    description: "Analyzes ETF fund flows and their market impact",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are an ETF analysis expert. Track and analyze fund flows.",
    active: true
  },
  {
    id: "legal-document",
    name: "Legal Document Agent",
    description: "Analyzes legal documents and regulatory filings",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a legal document expert. Analyze regulatory filings.",
    active: true
  },
  {
    id: "patent-analysis",
    name: "Patent Analysis Agent",
    description: "Analyzes patent portfolios and technological moats",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a patent analysis expert. Evaluate technological advantages.",
    active: true
  },
  {
    id: "sector-rotation",
    name: "Sector Rotation Agent",
    description: "Analyzes sector rotation patterns",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a sector rotation expert. Track sector movements.",
    active: true
  },
  {
    id: "market-breadth",
    name: "Market Breadth Agent",
    description: "Analyzes market breadth indicators",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a market breadth expert. Analyze market participation.",
    active: true
  },
  {
    id: "momentum",
    name: "Momentum Analysis Agent",
    description: "Analyzes price and volume momentum",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a momentum analysis expert. Track market momentum.",
    active: true
  },
  {
    id: "machine-learning",
    name: "Machine Learning Agent",
    description: "Applies machine learning to market analysis",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a machine learning expert. Apply ML to market data.",
    active: true
  },
  {
    id: "nlp",
    name: "NLP Agent",
    description: "Processes natural language market data",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are an NLP expert. Process textual market data.",
    active: true
  },
  {
    id: "time-series",
    name: "Time Series Forecaster Agent",
    description: "Forecasts market trends using time series analysis",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a time series analysis expert. Forecast market trends.",
    active: true
  },
  {
    id: "deep-learning",
    name: "Deep Learning Agent",
    description: "Applies deep learning to market analysis",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a deep learning expert. Apply neural networks to market data.",
    active: true
  },
  {
    id: "reinforcement-learning",
    name: "Reinforcement Learning Agent",
    description: "Applies RL to trading strategies",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a reinforcement learning expert. Optimize trading strategies.",
    active: true
  },
  {
    id: "ensemble-modeling",
    name: "Ensemble Modeling Agent",
    description: "Combines multiple models for analysis",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are an ensemble modeling expert. Combine multiple analysis methods.",
    active: true
  },
  {
    id: "alternative-data",
    name: "Alternative Data Analysis Agent",
    description: "Analyzes alternative data sources",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are an alternative data expert. Analyze non-traditional data sources.",
    active: true
  },
  {
    id: "seasonality",
    name: "Seasonality Analysis Agent",
    description: "Analyzes seasonal market patterns",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are a seasonality analysis expert. Identify recurring patterns.",
    active: true
  },
  {
    id: "liquidity",
    name: "Liquidity Analysis Agent",
    description: "Analyzes market liquidity conditions",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a liquidity analysis expert. Evaluate market liquidity.",
    active: true
  },
  {
    id: "options-market",
    name: "Options Market Analysis Agent",
    description: "Analyzes options market data",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are an options market expert. Analyze derivatives data.",
    active: true
  },
  {
    id: "regulatory-compliance",
    name: "Regulatory Compliance Agent",
    description: "Monitors regulatory compliance",
    model: "gpt-4o-mini",
    temperature: 0.3,
    systemPrompt: "You are a regulatory compliance expert. Monitor compliance requirements.",
    active: true
  },
  {
    id: "insider-trading",
    name: "Insider Trading Agent",
    description: "Tracks insider trading patterns",
    model: "gpt-4o-mini",
    temperature: 0.4,
    systemPrompt: "You are an insider trading expert. Monitor insider activities.",
    active: true
  }
];

const Agents = () => {
  const [agents, setAgents] = useState<AgentConfig[]>(defaultAgents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const { toast } = useToast();

  const handleAddAgent = () => {
    setSelectedAgent(null);
    setIsDialogOpen(true);
  };

  const handleEditAgent = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  const handleSaveAgent = (config: AgentConfig) => {
    setAgents(prev => {
      if (config.id && prev.find(a => a.id === config.id)) {
        return prev.map(a => a.id === config.id ? config : a);
      }
      return [...prev, { ...config, id: crypto.randomUUID() }];
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: `Agent ${config.name} has been ${config.id ? "updated" : "created"} successfully.`,
    });
  };

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? { ...agent, active: !agent.active }
          : agent
      )
    );
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== agentId));
    toast({
      title: "Agent Deleted",
      description: "The agent has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">AI Agents</h1>
            <p className="text-muted-foreground mt-2">
              Manage your AI-powered market analysis agents
            </p>
          </div>
          <Button onClick={handleAddAgent} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={() => handleEditAgent(agent)}
              onToggle={() => handleToggleAgent(agent.id)}
              onDelete={() => handleDeleteAgent(agent.id)}
            />
          ))}
        </div>

        <AgentConfigDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          agent={selectedAgent}
          onSave={handleSaveAgent}
        />
      </main>
    </div>
  );
};

export default Agents;
