
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Key, AlertTriangle } from "lucide-react";
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
  const [fmpKeyStatus, setFmpKeyStatus] = useState<'valid' | 'invalid' | 'checking' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadApiKeys();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const loadApiKeys = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('api_keys')
        .select('service, api_key');

      if (error) throw error;

      const keyMap: ApiKeys = { 
        openai: "", 
        anthropic: "", 
        openrouter: "", 
        deepseek: "",
        gemini: "", 
        fmp: "" 
      };

      data.forEach(({ service, api_key }) => {
        if (service in keyMap) {
          keyMap[service as keyof ApiKeys] = api_key;
        }
      });

      setApiKeys(keyMap);
      
      if (keyMap.fmp) {
        checkFmpKeyStatus(keyMap.fmp);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: "Error Loading API Keys",
        description: "There was an error loading your saved API keys",
        variant: "destructive",
      });
    }
  };

  const checkFmpKeyStatus = async (key: string) => {
    setFmpKeyStatus('checking');
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/stock/list?apikey=${key}`
      );

      if (response.status === 403) {
        const data = await response.json();
        if (data?.["Error Message"]?.includes("suspended")) {
          setFmpKeyStatus('invalid');
          toast({
            title: "API Key Error",
            description: "Your FMP API key appears to be suspended. Please check your key status at financialmodelingprep.com",
            variant: "destructive",
          });
          return;
        }
      }

      if (!response.ok) {
        setFmpKeyStatus('invalid');
        toast({
          title: "API Key Error",
          description: "Invalid FMP API key. Please check your key and try again.",
          variant: "destructive",
        });
        return;
      }

      setFmpKeyStatus('valid');
    } catch (error) {
      console.error('Error checking FMP key status:', error);
      setFmpKeyStatus('invalid');
    }
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // If FMP key is provided, validate it first
      if (apiKeys.fmp) {
        await checkFmpKeyStatus(apiKeys.fmp);
        if (fmpKeyStatus === 'invalid') {
          return;
        }
      }

      // Prepare API key entries for each non-empty key
      const entries = Object.entries(apiKeys)
        .filter(([_, value]) => value.trim().length > 0)
        .map(([service, api_key]) => ({
          user_id: session.user.id,
          service,
          api_key
        }));

      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('api_keys')
        .upsert(entries, {
          onConflict: 'user_id,service'
        });

      if (error) throw error;

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
                Manage your API keys for various services. These keys are stored securely in your database.
              </AlertDescription>
            </Alert>

            {fmpKeyStatus === 'invalid' && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>FMP API Key Error</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Your Financial Modeling Prep API key appears to be invalid or suspended.</p>
                  <p>Please visit <a href="https://financialmodelingprep.com/developer" className="underline" target="_blank" rel="noopener noreferrer">financialmodelingprep.com</a> to check your API key status or generate a new one.</p>
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">FMP API Key</label>
                  {renderApiKeyLink('fmp')}
                </div>
                <Input
                  type="password"
                  value={apiKeys.fmp}
                  onChange={(e) => {
                    setApiKeys(prev => ({ ...prev, fmp: e.target.value }));
                    setFmpKeyStatus(null);
                  }}
                  placeholder="Enter FMP API Key"
                  className={`bg-white/70 border-[#E5DEFF] ${
                    fmpKeyStatus === 'invalid' ? 'border-red-500' : 
                    fmpKeyStatus === 'valid' ? 'border-green-500' : ''
                  }`}
                />
                {fmpKeyStatus === 'checking' && (
                  <p className="text-sm text-muted-foreground">Checking API key status...</p>
                )}
              </div>

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
