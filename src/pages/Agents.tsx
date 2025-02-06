
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AgentConfigDialog } from "@/components/agents/AgentConfigDialog";
import { LLMProviderSection } from "@/components/agents/LLMProviderSection";
import { RAGSection } from "@/components/agents/RAGSection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AgentListFilters } from "@/components/agents/AgentListFilters";
import { AgentList } from "@/components/agents/AgentList";
import { useAgents, type AgentConfig } from "@/hooks/useAgents";
import { AgentTestDialog } from "@/components/agents/AgentTestDialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Agents = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "model">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  const { agents, handleSaveAgent, handleToggleAgent, handleDeleteAgent } = useAgents();

  const handleAddAgent = () => {
    setSelectedAgent(null);
    setIsDialogOpen(true);
  };

  const handleEditAgent = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  const handleTestAgent = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setIsTestDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">AI Management</h1>
            <p className="text-muted-foreground mt-2">
              Configure your AI agents, LLM providers, and knowledge base
            </p>
          </div>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="providers">LLM Providers</TabsTrigger>
            <TabsTrigger value="rag">Knowledge Base</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">AI Agents</div>
              <Button onClick={handleAddAgent} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Agent
              </Button>
            </div>

            <AgentListFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            <AgentList
              agents={agents}
              searchQuery={searchQuery}
              sortField={sortField}
              sortDirection={sortDirection}
              activeFilter={activeFilter}
              onEdit={handleEditAgent}
              onToggle={handleToggleAgent}
              onDelete={handleDeleteAgent}
              onTest={handleTestAgent}
            />
          </TabsContent>

          <TabsContent value="providers">
            <LLMProviderSection />
          </TabsContent>

          <TabsContent value="rag">
            <RAGSection />
          </TabsContent>
        </Tabs>

        <AgentConfigDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          agent={selectedAgent}
          onSave={handleSaveAgent}
        />

        {selectedAgent && (
          <AgentTestDialog
            open={isTestDialogOpen}
            onOpenChange={setIsTestDialogOpen}
            agent={selectedAgent}
          />
        )}
      </main>
    </div>
  );
};

export default Agents;

