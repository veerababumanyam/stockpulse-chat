
import { RAGConfig } from "@/components/agents/rag/types";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  active: boolean;
  rag?: RAGConfig;
}
