
import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentConfigDialog } from "@/components/agents/AgentConfigDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  active: boolean;
}

// Function to generate agent ID from class name
const generateAgentId = (className: string) => {
  return className.replace(/Agent$/, "").replace(/([A-Z])/g, "-$1").toLowerCase().slice(1);
};

// Function to generate agent name from class name
const generateAgentName = (className: string) => {
  return className.replace(/Agent$/, "").replace(/([A-Z])/g, " $1").trim();
};

// Function to generate description based on name
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

const Agents = () => {
  const [agents, setAgents] = useState<AgentConfig[]>(defaultAgents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "model">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
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

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  const filteredAndSortedAgents = useMemo(() => {
    return agents
      .filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            agent.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesActiveFilter = activeFilter === null || agent.active === activeFilter;
        return matchesSearch && matchesActiveFilter;
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        if (sortField === "name") {
          return direction * a.name.localeCompare(b.name);
        }
        return direction * a.model.localeCompare(b.model);
      });
  }, [agents, searchQuery, sortField, sortDirection, activeFilter]);

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

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={activeFilter === true}
                  onCheckedChange={() => setActiveFilter(activeFilter === true ? null : true)}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilter === false}
                  onCheckedChange={() => setActiveFilter(activeFilter === false ? null : false)}
                >
                  Inactive
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select value={sortField} onValueChange={(value: "name" | "model") => setSortField(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="model">Model</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={toggleSortDirection}
              className="flex items-center gap-2"
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedAgents.map(agent => (
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

