
import { Navigation } from "@/components/Navigation";
import ChatWindow from "@/components/ChatWindow";
import { TrendingUp, DollarSign, LineChart } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [hasApiKey, setHasApiKey] = useState(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      return !!parsedKeys.fmp;
    }
    return false;
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Instead of automatically redirecting, show a message and provide a button
  const handleSetupApiKey = () => {
    toast({
      title: "API Key Required",
      description: "You'll need to set up your API key to access market data.",
      action: {
        label: "Set up now",
        onClick: () => navigate('/api-keys')
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-[72px]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <main className="p-8">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4 animate-fadeIn">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Welcome to StockPulse
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Your AI-powered stock market analysis assistant. Ask questions about stocks,
                    market trends, and get real-time insights.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {!hasApiKey ? (
                    <div className="col-span-3 glass-panel p-6 rounded-xl animate-float">
                      <h3 className="text-xl font-semibold mb-4">Get Started</h3>
                      <p className="text-muted-foreground mb-4">
                        To access real-time market data and AI-powered analysis, you'll need to set up your API key first.
                      </p>
                      <button
                        onClick={handleSetupApiKey}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Set up API Key
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="glass-panel p-6 rounded-xl animate-float">
                        <TrendingUp className="w-8 h-8 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
                        <p className="text-muted-foreground">
                          Get real-time insights into market trends and patterns
                        </p>
                      </div>

                      <div className="glass-panel p-6 rounded-xl animate-float">
                        <DollarSign className="w-8 h-8 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Stock Tracking</h3>
                        <p className="text-muted-foreground">
                          Monitor your favorite stocks and get instant updates
                        </p>
                      </div>

                      <div className="glass-panel p-6 rounded-xl animate-float">
                        <LineChart className="w-8 h-8 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Smart Predictions</h3>
                        <p className="text-muted-foreground">
                          AI-powered predictions based on historical data
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25} minSize={20} maxSize={50}>
            <ChatWindow />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Dashboard;
