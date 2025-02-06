
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
}

const Profile = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", fmp: "" });
  const { toast } = useToast();

  // Load API keys on component mount
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
    if (!apiKeys.openai || !apiKeys.fmp) {
      toast({
        title: "Error",
        description: "Please enter both API keys",
        variant: "destructive",
      });
      return;
    }
    // Save API keys to localStorage
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Key className="w-6 h-6" />
              API Key Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
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
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">FMP API Key</label>
                <Input
                  type="password"
                  value={apiKeys.fmp}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, fmp: e.target.value }))}
                  placeholder="Enter FMP API Key"
                />
              </div>
              <Button type="submit" className="w-full">
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

