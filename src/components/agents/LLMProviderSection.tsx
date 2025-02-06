
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LLMProvider {
  id: string;
  name: string;
  apiKey: string;
  isEnabled: boolean;
  models: string[];
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
        models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4o-vision', 'gpt-4o-1106']
      },
      {
        id: 'deepseek',
        name: 'Deepseek',
        apiKey: '',
        isEnabled: false,
        models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner']
      }
    ];
  });

  const { toast } = useToast();

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
    setProviders(prev => {
      const updated = prev.map(provider =>
        provider.id === providerId
          ? { ...provider, apiKey }
          : provider
      );
      localStorage.setItem('llm-providers', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "API Key Updated",
      description: "The API key has been saved successfully.",
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
