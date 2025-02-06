
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Key } from "lucide-react";

interface ApiKeys {
  openai: string;
  fmp: string;
  deepseek: string;
}

const Profile = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", fmp: "", deepseek: "" });
  const { toast } = useToast();

  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      setApiKeys(parsedKeys);
      toast({
        title: "API Keys Loaded",
        description: "Your saved API keys have been loaded successfully",
      });
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeys.openai || !apiKeys.fmp || !apiKeys.deepseek) {
      toast({
        title: "Error",
        description: "Please enter all API keys",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    toast({
      title: "Success",
      description: "API keys saved successfully",
    });
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
                <label className="text-sm font-medium">OpenAI API Key</label>
                <Input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                  placeholder="Enter OpenAI API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">FMP API Key</label>
                <Input
                  type="password"
                  value={apiKeys.fmp}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, fmp: e.target.value }))}
                  placeholder="Enter FMP API Key"
                  className="bg-white/70 border-[#E5DEFF]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deepseek API Key</label>
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

export default Profile;

