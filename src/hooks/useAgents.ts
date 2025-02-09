
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AgentConfig } from "@/types/agent";
import { agentService } from "@/services/agentService";

export const useAgents = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const loadedAgents = agentService.loadAgents();
      setAgents(loadedAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const handleSaveAgent = (config: AgentConfig) => {
    try {
      const updatedAgents = agentService.saveAgent(config);
      setAgents(updatedAgents);
      
      toast({
        title: "Success",
        description: `Agent ${config.name} has been ${config.id ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error",
        description: "Failed to save agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAgent = (agentId: string) => {
    try {
      setAgents(prev => agentService.toggleAgent(agentId, prev));
    } catch (error) {
      console.error('Error toggling agent:', error);
      toast({
        title: "Error",
        description: "Failed to toggle agent status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAgent = (agentId: string) => {
    try {
      setAgents(prev => agentService.deleteAgent(agentId, prev));
      
      toast({
        title: "Agent Deleted",
        description: "The agent has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    agents,
    handleSaveAgent,
    handleToggleAgent,
    handleDeleteAgent
  };
};

export type { AgentConfig };

