
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LLMProvider {
  id: string;
  name: string;
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
        isEnabled: true,
        models: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-4-vision-preview', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k']
      },
      {
        id: 'deepseek',
        name: 'Deepseek',
        isEnabled: false,
        models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner', 'deepseek-english', 'deepseek-math']
      }
    ];
  });

  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKeys | null>(null);

  useEffect(() => {
    const savedApiKeys = localStorage.getItem('apiKeys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
  }, []);

  const handleProviderToggle = (providerId: string) => {
    if (!apiKeys?.[providerId as keyof ApiKeys]) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">LLM Providers</h2>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Manage your API keys in the{" "}
          <Link to="/api-keys" className="font-medium underline underline-offset-4">
            API Keys page
          </Link>
        </AlertDescription>
      </Alert>

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
                <div>
                  <h3 className="font-medium mb-2">Available Models</h3>
                  <ul className="space-y-1">
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

