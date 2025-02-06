
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { AlertCircle, Info, Settings2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface LLMProvider {
  id: string;
  name: string;
  isEnabled: boolean;
  models: string[];
  description: string;
  capabilities: string[];
  selectedModels?: string[];
}

interface ApiKeys {
  openai?: string;
  deepseek?: string;
  fmp?: string;
}

const defaultProviders: LLMProvider[] = [
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
    models: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-4-vision-preview', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
    selectedModels: ['gpt-4', 'gpt-3.5-turbo']
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
    models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner', 'deepseek-english', 'deepseek-math'],
    selectedModels: ['deepseek-chat', 'deepseek-coder']
  }
];

export const LLMProviderSection = () => {
  const [providers, setProviders] = useState<LLMProvider[]>(() => {
    try {
      const savedProviders = localStorage.getItem('llm-providers');
      return savedProviders ? JSON.parse(savedProviders) : defaultProviders;
    } catch (error) {
      console.error('Error parsing saved providers:', error);
      return defaultProviders;
    }
  });

  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Language Model Providers</h2>
          <p className="text-muted-foreground mt-1">
            Configure your AI providers to enhance agent capabilities
          </p>
        </div>
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
        {providers && providers.map((provider) => (
          <Card key={provider.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{provider.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {provider.description}
                  </p>
                </div>
                <Switch
                  checked={provider.isEnabled}
                  onCheckedChange={() => handleProviderToggle(provider.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Key Capabilities
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                    {provider.capabilities && provider.capabilities.map((capability, index) => (
                      <li key={index}>{capability}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Available Models</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => setSelectedProvider(provider)}
                        >
                          <Settings2 className="h-4 w-4" />
                          Configure Models
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Configure Models for {provider.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <p className="text-sm text-muted-foreground">
                            Select the models you want to use with your AI agents
                          </p>
                          <div className="space-y-2">
                            {provider.models && provider.models.map((model) => (
                              <div key={model} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${provider.id}-${model}`}
                                  checked={(provider.selectedModels || []).includes(model)}
                                  onCheckedChange={(checked) => 
                                    handleModelSelection(provider.id, model, checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor={`${provider.id}-${model}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {model}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {provider.selectedModels && provider.selectedModels.map((model) => (
                      <Badge key={model} variant="secondary">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
