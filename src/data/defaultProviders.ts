import { LLMProvider } from "@/types/llm";

export const defaultProviders: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    isEnabled: true,
    description: 'Leading AI technology provider offering state-of-the-art language models',
    capabilities: [
      'Advanced natural language understanding',
      'Context-aware responses',
      'Code generation and analysis',
      'Multi-modal capabilities with vision models'
    ],
    models: [],
    selectedModels: []
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    isEnabled: false,
    description: 'Provider of Claude models known for their safety and reliability',
    capabilities: [
      'Constitutional AI principles',
      'Long context windows',
      'Factual responses',
      'Complex reasoning tasks'
    ],
    models: [],
    selectedModels: []
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    isEnabled: false,
    description: 'Gateway to multiple AI models with unified API access',
    capabilities: [
      'Access to multiple model providers',
      'Unified API interface',
      'Cost optimization',
      'Model performance comparison'
    ],
    models: [],
    selectedModels: []
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    isEnabled: false,
    description: 'Google\'s advanced multimodal AI model with strong reasoning capabilities',
    capabilities: [
      'Multimodal understanding',
      'Advanced reasoning',
      'Code generation and analysis',
      'Real-time information processing'
    ],
    models: [],
    selectedModels: []
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    isEnabled: false,
    description: 'Specialized AI models focused on deep learning and specific domain expertise',
    capabilities: [
      'Specialized code understanding',
      'Mathematical reasoning',
      'Domain-specific analysis',
      'Technical documentation generation'
    ],
    models: [],
    selectedModels: []
  },
  {
    id: 'ollama',
    name: 'Ollama',
    isEnabled: false,
    description: 'Open-source, self-hosted LLM provider supporting various models',
    capabilities: [
      'Self-hosted deployment',
      'Multiple model support',
      'Local processing',
      'Custom model integration',
      'IP-based access'
    ],
    models: [],
    selectedModels: []
  }
];
