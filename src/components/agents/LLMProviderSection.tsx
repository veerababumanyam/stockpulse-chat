
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { defaultProviders } from "@/data/defaultProviders";
import { 
  fetchOpenAIModels, 
  fetchAnthropicModels, 
  fetchOpenRouterModels, 
  fetchDeepseekModels,
  fetchGeminiModels 
} from "@/utils/modelApis";
import { ProviderCard } from "./ProviderCard";
import type { LLMProvider, ApiKeys } from "@/types/llm";

export const LLMProviderSection = () => {
  const [providers, setProviders] = useState<LLMProvider[]>(() => {
    const savedProviders = localStorage.getItem('llm-providers');
    if (savedProviders) {
      try {
        const parsed = JSON.parse(savedProviders);
        // Ensure we have all default providers
        const allProviders = defaultProviders.map(defaultProvider => {
          const savedProvider = parsed.find((p: LLMProvider) => p.id === defaultProvider.id);
          return savedProvider || defaultProvider;
        });
        return allProviders;
      } catch (error) {
        console.error('Error parsing saved providers:', error);
        return defaultProviders;
      }
    }
    return defaultProviders;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});

  useEffect(() => {
    const savedApiKeys = localStorage.getItem('apiKeys');
    if (savedApiKeys) {
      try {
        const parsed = JSON.parse(savedApiKeys);
        setApiKeys(parsed || {});
      } catch (error) {
        console.error('Error parsing API keys:', error);
        setApiKeys({});
      }
    }
  }, []);

  const refreshModels = async () => {
    setIsLoading(true);
    try {
      const updatedProviders = [...providers];

      for (const provider of updatedProviders) {
        if (!apiKeys[provider.id as keyof ApiKeys]) {
          continue;
        }

        try {
          let models: string[] = [];
          switch (provider.id) {
            case 'openai':
              models = await fetchOpenAIModels(apiKeys.openai!);
              break;
            case 'anthropic':
              models = await fetchAnthropicModels(apiKeys.anthropic!);
              break;
            case 'openrouter':
              models = await fetchOpenRouterModels(apiKeys.openrouter!);
              break;
            case 'deepseek':
              models = await fetchDeepseekModels(apiKeys.deepseek!);
              break;
            case 'gemini':
              models = await fetchGeminiModels(apiKeys.gemini!);
              break;
          }

          provider.models = models;
          provider.selectedModels = provider.selectedModels?.filter(model => 
            models.includes(model)
          ) || [];
        } catch (error) {
          console.error(`Error fetching models for ${provider.name}:`, error);
          toast({
            title: `Error Fetching Models`,
            description: `Could not fetch models for ${provider.name}. Please check your API key.`,
            variant: "destructive",
          });
        }
      }

      setProviders(updatedProviders);
      localStorage.setItem('llm-providers', JSON.stringify(updatedProviders));
      
      toast({
        title: "Models Updated",
        description: "Available models have been refreshed successfully.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderToggle = (providerId: string) => {
    const hasValidApiKey = apiKeys && apiKeys[providerId as keyof ApiKeys];
    
    if (!hasValidApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set up your API key in the API Keys page first.",
        variant: "destructive",
      });
      return;
    }

    setProviders(prev => {
      const updated = prev.map(provider =>
        provider.id === providerId
          ? { ...provider, isEnabled: !provider.isEnabled }
          : provider
      );
      localStorage.setItem('llm-providers', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Provider Updated",
      description: "Provider settings have been updated successfully.",
    });
  };

  const handleModelSelection = (providerId: string, model: string, isSelected: boolean) => {
    setProviders(prev => {
      const updated = prev.map(provider => {
        if (provider.id === providerId) {
          const selectedModels = provider.selectedModels || [];
          const updatedModels = isSelected
            ? [...selectedModels, model]
            : selectedModels.filter(m => m !== model);
          
          return {
            ...provider,
            selectedModels: updatedModels
          };
        }
        return provider;
      });
      
      localStorage.setItem('llm-providers', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Language Model Providers</h2>
        <p className="text-muted-foreground mt-1">
          Configure your AI providers to enhance agent capabilities
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            API keys are required to use these providers. Manage your keys in the{" "}
            <Link to="/api-keys" className="font-medium underline underline-offset-4">
              API Keys page
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Your API keys are securely stored and used only for interacting with the selected providers.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isLoading={isLoading}
            onToggle={handleProviderToggle}
            onModelSelection={handleModelSelection}
            onRefresh={refreshModels}
          />
        ))}
      </div>
    </div>
  );
};
