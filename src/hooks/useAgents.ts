
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AgentConfig } from "@/types/agent";
import { agentService } from "@/services/agentService";

export const useAgents = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadedAgents = agentService.loadAgents();
    setAgents(loadedAgents);
  }, []);

  const handleSaveAgent = (config: AgentConfig) => {
    const updatedAgents = agentService.saveAgent(config);
    setAgents(updatedAgents);
    
    toast({
      title: "Success",
      description: `Agent ${config.name} has been ${config.id ? "updated" : "created"} successfully.`,
    });
  };

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev => agentService.toggleAgent(agentId, prev));
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(prev => agentService.deleteAgent(agentId, prev));
    
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

