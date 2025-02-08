
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { BaseAnalysisAgent } from "@/agents/types/AgentTypes";
import { defaultConfig } from "@/components/agents/rag/types";
import { AgentConfig } from "@/types/agent";
import { agentClassNames } from "@/config/agentClassNames";
import { generateAgentId, generateAgentName, generateDescription } from "@/utils/agentUtils";

const STORAGE_KEY = 'ai-agents-config';

const defaultAgents: AgentConfig[] = agentClassNames.map(className => ({
  id: generateAgentId(className),
  name: generateAgentName(className),
  description: generateDescription(generateAgentName(className)),
  model: "gpt-4-turbo",
  temperature: 0.3 + (Math.random() * 0.2),
  systemPrompt: `You are a ${generateAgentName(className).toLowerCase()} expert. Analyze and provide insights in your domain.`,
  active: true,
  rag: defaultConfig,
}));

export const useAgents = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedAgents = localStorage.getItem(STORAGE_KEY);
    if (savedAgents) {
      const parsedAgents = JSON.parse(savedAgents);
      setAgents(parsedAgents);
      
      parsedAgents.forEach((agent: AgentConfig) => {
        if (agent.active) {
          const dynamicAgent = new BaseAnalysisAgent();
          if (agent.rag?.enabled) {
            dynamicAgent.configureRAG(agent.rag);
          }
          OrchestratorAgent.registerAgent(agent.id, dynamicAgent);
        }
      });
    } else {
      setAgents(defaultAgents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAgents));
      
      defaultAgents.forEach(agent => {
        if (agent.active) {
          const dynamicAgent = new BaseAnalysisAgent();
          if (agent.rag?.enabled) {
            dynamicAgent.configureRAG(agent.rag);
          }
          OrchestratorAgent.registerAgent(agent.id, dynamicAgent);
        }
      });
    }
  }, []);

  const handleSaveAgent = (config: AgentConfig) => {
    setAgents(prev => {
      const newAgents = config.id && prev.find(a => a.id === config.id)
        ? prev.map(a => a.id === config.id ? config : a)
        : [...prev, { ...config, id: crypto.randomUUID() }];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));

      if (config.active) {
        const dynamicAgent = new BaseAnalysisAgent();
        if (config.rag?.enabled) {
          dynamicAgent.configureRAG(config.rag);
        }
        OrchestratorAgent.registerAgent(config.id || crypto.randomUUID(), dynamicAgent);
      }

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

      const updatedAgent = newAgents.find(a => a.id === agentId);
      if (updatedAgent) {
        if (updatedAgent.active) {
          const dynamicAgent = new BaseAnalysisAgent();
          OrchestratorAgent.registerAgent(agentId, dynamicAgent);
        }
      }

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
