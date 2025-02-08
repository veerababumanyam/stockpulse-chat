
import { AgentConfig } from "@/types/agent";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { BaseAnalysisAgent } from "@/agents/types/AgentTypes";
import { defaultConfig } from "@/components/agents/rag/types";
import { agentClassNames } from "@/config/agentClassNames";
import { generateAgentId, generateAgentName, generateDescription } from "@/utils/agentUtils";

const STORAGE_KEY = 'ai-agents-config';

export const defaultAgents: AgentConfig[] = agentClassNames.map(className => ({
  id: generateAgentId(className),
  name: generateAgentName(className),
  description: generateDescription(generateAgentName(className)),
  model: "gpt-4-turbo",
  temperature: 0.3 + (Math.random() * 0.2),
  systemPrompt: `You are a ${generateAgentName(className).toLowerCase()} expert. Analyze and provide insights in your domain.`,
  active: true,
  rag: defaultConfig,
}));

export const agentService = {
  loadAgents: (): AgentConfig[] => {
    const savedAgents = localStorage.getItem(STORAGE_KEY);
    if (savedAgents) {
      const parsedAgents = JSON.parse(savedAgents);
      
      parsedAgents.forEach((agent: AgentConfig) => {
        if (agent.active) {
          const dynamicAgent = new BaseAnalysisAgent();
          if (agent.rag?.enabled) {
            dynamicAgent.configureRAG(agent.rag);
          }
          OrchestratorAgent.registerAgent(agent.id, dynamicAgent);
        }
      });
      
      return parsedAgents;
    }
    
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
    
    return defaultAgents;
  },

  saveAgent: (config: AgentConfig): AgentConfig[] => {
    const currentAgents = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newAgents = config.id && currentAgents.find((a: AgentConfig) => a.id === config.id)
      ? currentAgents.map((a: AgentConfig) => a.id === config.id ? config : a)
      : [...currentAgents, { ...config, id: crypto.randomUUID() }];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));

    if (config.active) {
      const dynamicAgent = new BaseAnalysisAgent();
      if (config.rag?.enabled) {
        dynamicAgent.configureRAG(config.rag);
      }
      OrchestratorAgent.registerAgent(config.id || crypto.randomUUID(), dynamicAgent);
    }

    return newAgents;
  },

  toggleAgent: (agentId: string, agents: AgentConfig[]): AgentConfig[] => {
    const newAgents = agents.map(agent =>
      agent.id === agentId
        ? { ...agent, active: !agent.active }
        : agent
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));

    const updatedAgent = newAgents.find(a => a.id === agentId);
    if (updatedAgent && updatedAgent.active) {
      const dynamicAgent = new BaseAnalysisAgent();
      if (updatedAgent.rag?.enabled) {
        dynamicAgent.configureRAG(updatedAgent.rag);
      }
      OrchestratorAgent.registerAgent(agentId, dynamicAgent);
    }

    return newAgents;
  },

  deleteAgent: (agentId: string, agents: AgentConfig[]): AgentConfig[] => {
    const newAgents = agents.filter(agent => agent.id !== agentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));
    return newAgents;
  }
};

