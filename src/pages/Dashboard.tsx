
import { Navigation } from "@/components/Navigation";
import ChatWindow from "@/components/ChatWindow";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ToastAction } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { MarketMovers } from "@/components/dashboard/MarketMovers";
import { AnalystInsights } from "@/components/dashboard/AnalystInsights";
import { MarketNews } from "@/components/dashboard/MarketNews";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const Dashboard = () => {
  const [hasApiKey, setHasApiKey] = useState(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      return !!parsedKeys.fmp;
    }
    return false;
  });

  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!hasApiKey) return;
      
      try {
        const savedKeys = localStorage.getItem('apiKeys');
        if (!savedKeys) throw new Error('API key not found');
        
        const { fmp } = JSON.parse(savedKeys);
        
        const [gainersResponse, losersResponse] = await Promise.all([
          fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${fmp}`),
          fetch(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${fmp}`)
        ]);

        if (!gainersResponse.ok || !losersResponse.ok) {
          throw new Error('Failed to fetch market data');
        }

        const gainersData = await gainersResponse.json();
        const losersData = await losersResponse.json();

        setTopGainers(gainersData.slice(0, 5));
        setTopLosers(losersData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching market data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch market data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [hasApiKey, toast]);

  const handleSetupApiKey = () => {
    toast({
      title: "API Key Required",
      description: "You'll need to set up your API key to access market data.",
      action: (
        <ToastAction altText="Set up API key" onClick={() => navigate('/api-keys')}>
          Set up now
        </ToastAction>
      ),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-[72px]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <main className="p-8">
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Market Overview
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Track market movements and get AI-powered insights
                  </p>
                </div>

                {!hasApiKey ? (
                  <Card className="p-6">
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        To access real-time market data and AI-powered analysis, you'll need to set up your API key first.
                      </p>
                      <button
                        onClick={handleSetupApiKey}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Set up API Key
                      </button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <MarketMovers 
                      gainers={topGainers}
                      losers={topLosers}
                      isLoading={isLoading}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnalystInsights symbol="SPY" />
                      <MarketNews />
                    </div>
                  </>
                )}
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
