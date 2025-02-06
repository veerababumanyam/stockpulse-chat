
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Key } from "lucide-react";
import type { ApiKeys } from "@/types/llm";

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ 
    openai: "", 
    anthropic: "", 
    openrouter: "", 
    deepseek: "",
    gemini: "", 
    fmp: "" 
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        setApiKeys(prev => ({ ...prev, ...parsedKeys }));
        console.log('Loaded API keys from localStorage');
      } catch (error) {
        console.error('Error parsing saved API keys:', error);
        toast({
          title: "Error Loading API Keys",
          description: "There was an error loading your saved API keys",
          variant: "destructive",
        });
      }
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty API keys before saving
      const nonEmptyKeys = Object.fromEntries(
        Object.entries(apiKeys).filter(([_, value]) => value.trim().length > 0)
      );
      localStorage.setItem('apiKeys', JSON.stringify(nonEmptyKeys));
      toast({
        title: "Success",
        description: "API keys saved successfully",
      });
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to save API keys",
        variant: "destructive",
      });
    }
  };

  const renderApiKeyLink = (provider: string) => {
    const links: Record<string, string> = {
      openai: "https://platform.openai.com/api-keys",
      anthropic: "https://console.anthropic.com/account/keys",
      openrouter: "https://openrouter.ai/keys",
      deepseek: "https://platform.deepseek.com/api-keys",
      gemini: "https://makersuite.google.com/app/apikey",
      fmp: "https://site.financialmodelingprep.com/developer/docs/api-keys",
    };

    return (
      <a
        href={links[provider]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
      >
        Get API Key <ExternalLink className="h-3 w-3" />
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card className="bg-white/50 backdrop-blur-sm border-[#E5DEFF]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-[#8B5CF6]">
              <Key className="w-6 h-6" />
              API Key Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-[#F1F0FB] border-[#E5DEFF]">
              <AlertDescription>
                Manage your API keys for various services. These keys are stored securely in your browser's local storage.
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">OpenAI API Key</label>
                  {renderApiKeyLink('openai')}
                </div>
                <Input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                  placeholder="Enter OpenAI API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Anthropic API Key</label>
                  {renderApiKeyLink('anthropic')}
                </div>
                <Input
                  type="password"
                  value={apiKeys.anthropic}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                  placeholder="Enter Anthropic API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">OpenRouter API Key</label>
                  {renderApiKeyLink('openrouter')}
                </div>
                <Input
                  type="password"
                  value={apiKeys.openrouter}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openrouter: e.target.value }))}
                  placeholder="Enter OpenRouter API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Google Gemini API Key</label>
                  {renderApiKeyLink('gemini')}
                </div>
                <Input
                  type="password"
                  value={apiKeys.gemini}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                  placeholder="Enter Google Gemini API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Deepseek API Key</label>
                  {renderApiKeyLink('deepseek')}
                </div>
                <Input
                  type="password"
                  value={apiKeys.deepseek}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, deepseek: e.target.value }))}
                  placeholder="Enter Deepseek API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">FMP API Key</label>
                  {renderApiKeyLink('fmp')}
                </div>
                <Input
                  type="password"
                  value={apiKeys.fmp}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, fmp: e.target.value }))}
                  placeholder="Enter FMP API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Save API Keys
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiKeys;

