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
