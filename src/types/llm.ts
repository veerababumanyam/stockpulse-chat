
export interface LLMProvider {
  id: string;
  name: string;
  isEnabled: boolean;
  models: string[];
  description: string;
  capabilities: string[];
  selectedModels?: string[];
}

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  openrouter?: string;
  deepseek?: string;
  gemini?: string;
  fmp?: string;
}
