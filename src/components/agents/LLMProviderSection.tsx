
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LLMProvider {
  id: string;
  name: string;
  apiKey: string;
  isEnabled: boolean;
  models: string[];
}

interface ApiKeys {
  openai: string;
  deepseek: string;
  fmp: string;
}

export const LLMProviderSection = () => {
  const [providers, setProviders] = useState<LLMProvider[]>(() => {
    const savedProviders = localStorage.getItem('llm-providers');
    return savedProviders ? JSON.parse(savedProviders) : [
      {
        id: 'openai',
        name: 'OpenAI',
        apiKey: '',
        isEnabled: true,
        models: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-4-vision-preview', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k']
      },
      {
        id: 'deepseek',
        name: 'Deepseek',
        apiKey: '',
        isEnabled: false,
        models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner', 'deepseek-english', 'deepseek-math']
      }
    ];
  });

  const { toast } = useToast();

  // Load API keys from API Keys page storage
  useEffect(() => {
    const savedApiKeys = localStorage.getItem('apiKeys');
    if (savedApiKeys) {
      const apiKeys: ApiKeys = JSON.parse(savedApiKeys);
      setProviders(prev => prev.map(provider => ({
        ...provider,
        apiKey: apiKeys[provider.id as keyof ApiKeys] || ''
      })));
    }
  }, []);

  const handleProviderToggle = (providerId: string) => {
    setProviders(prev => {
      const updated = prev.map(provider =>
        provider.id === providerId
          ? { ...provider, isEnabled: !provider.isEnabled }
          : provider
      );
      localStorage.setItem('llm-providers', JSON.stringify(updated));
      return updated;
    });
  };

  const handleApiKeyUpdate = (providerId: string, apiKey: string) => {
    // Update both the providers state and the API Keys storage
    setProviders(prev => {
      const updated = prev.map(provider =>
        provider.id === providerId
          ? { ...provider, apiKey }
          : provider
      );
      localStorage.setItem('llm-providers', JSON.stringify(updated));
      return updated;
    });

    // Update API Keys storage
    const savedApiKeys = localStorage.getItem('apiKeys');
    const apiKeys: ApiKeys = savedApiKeys ? JSON.parse(savedApiKeys) : {
      openai: '',
      deepseek: '',
      fmp: ''
    };
    apiKeys[providerId as keyof ApiKeys] = apiKey;
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));

    toast({
      title: "API Key Updated",
      description: "The API key has been saved successfully in both locations.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">LLM Providers</h2>
        <Button variant="outline">Add Provider</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{provider.name}</CardTitle>
                <Switch
                  checked={provider.isEnabled}
                  onCheckedChange={() => handleProviderToggle(provider.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                  <Input
                    id={`${provider.id}-api-key`}
                    type="password"
                    value={provider.apiKey}
                    onChange={(e) => handleApiKeyUpdate(provider.id, e.target.value)}
                    placeholder="Enter API key"
                  />
                </div>
                <div>
                  <Label>Available Models</Label>
                  <ul className="mt-2 space-y-1">
                    {provider.models.map((model) => (
                      <li key={model} className="text-sm text-muted-foreground">
                        {model}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
