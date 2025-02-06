
import type { LLMProvider } from "@/types/llm";

export const loadModels = (savedProviders: string | null) => {
  if (!savedProviders) {
    return {
      availableModels: [],
      flatModels: []
    };
  }

  try {
    const providers: LLMProvider[] = JSON.parse(savedProviders);
    const enabledProviders = providers.filter(p => p.isEnabled);
    const models = enabledProviders.map(provider => ({
      provider: provider.name,
      models: provider.selectedModels || []
    })).filter(p => p.models.length > 0);
    
    const allModels = models.flatMap(provider => provider.models);
    
    return {
      availableModels: models.length > 0 ? models : [],
      flatModels: allModels
    };
  } catch (error) {
    console.error('Error parsing providers:', error);
    return {
      availableModels: [],
      flatModels: []
    };
  }
};

