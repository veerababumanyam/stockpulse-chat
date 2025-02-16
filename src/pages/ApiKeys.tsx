import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Key, AlertTriangle, Eye, EyeOff } from "lucide-react";
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
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
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

      if (apiKeys.fmp) {
        await checkFmpKeyStatus(apiKeys.fmp);
        if (fmpKeyStatus === 'invalid') {
          return;
        }
      }

      const entries = Object.entries(apiKeys)
        .filter(([_, value]) => value.trim().length > 0)
        .map(([service, api_key]) => ({
          user_id: session.user.id,
          service,
          api_key
        }));

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

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderApiKeyInput = (service: keyof ApiKeys, label: string) => {
    const isVisible = visibleKeys[service] || false;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">{label}</label>
          {renderApiKeyLink(service)}
        </div>
        <div className="relative">
          <Input
            type={isVisible ? "text" : "password"}
            value={apiKeys[service]}
            onChange={(e) => {
              setApiKeys(prev => ({ ...prev, [service]: e.target.value }));
              if (service === 'fmp') {
                setFmpKeyStatus(null);
              }
            }}
            placeholder={`Enter ${label}`}
            className={`bg-white/70 border-[#E5DEFF] pr-10 ${
              service === 'fmp' && fmpKeyStatus === 'invalid' ? 'border-red-500' : 
              service === 'fmp' && fmpKeyStatus === 'valid' ? 'border-green-500' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => toggleKeyVisibility(service)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {service === 'fmp' && fmpKeyStatus === 'checking' && (
          <p className="text-sm text-muted-foreground">Checking API key status...</p>
        )}
      </div>
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
              {renderApiKeyInput('fmp', 'FMP API Key')}
              {renderApiKeyInput('openai', 'OpenAI API Key')}
              {renderApiKeyInput('anthropic', 'Anthropic API Key')}
              {renderApiKeyInput('openrouter', 'OpenRouter API Key')}
              {renderApiKeyInput('gemini', 'Google Gemini API Key')}
              {renderApiKeyInput('deepseek', 'Deepseek API Key')}

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
