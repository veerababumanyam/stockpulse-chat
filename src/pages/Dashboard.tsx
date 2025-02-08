
import { Navigation } from "@/components/Navigation";
import ChatWindow from "@/components/ChatWindow";
import { TrendingUp, TrendingDown, LineChart, BarChart, BookOpen, DollarSign } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ToastAction } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatPercentage, getPriceChangeColor } from "@/utils/formatting";

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

  const MarketMoverCard = ({ title, stocks, icon: Icon }: { 
    title: string;
    stocks: StockData[];
    icon: any;
  }) => (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(stock.price)}</div>
                <div className={getPriceChangeColor(stock.changePercent)}>
                  {formatPercentage(stock.changePercent / 100)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

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
                    <CardHeader>
                      <CardTitle>Get Started</CardTitle>
                    </CardHeader>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoading ? (
                      Array(2).fill(0).map((_, i) => (
                        <Card key={i} className="h-[400px] animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                            <div className="space-y-4">
                              {Array(5).fill(0).map((_, j) => (
                                <div key={j} className="flex justify-between">
                                  <div className="h-4 bg-muted rounded w-1/4" />
                                  <div className="h-4 bg-muted rounded w-1/4" />
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <>
                        <MarketMoverCard 
                          title="Top Gainers" 
                          stocks={topGainers} 
                          icon={TrendingUp}
                        />
                        <MarketMoverCard 
                          title="Top Losers" 
                          stocks={topLosers} 
                          icon={TrendingDown}
                        />
                      </>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass-panel p-6">
                    <LineChart className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
                    <p className="text-muted-foreground">
                      Get real-time insights into market trends and patterns
                    </p>
                  </Card>

                  <Card className="glass-panel p-6">
                    <BookOpen className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">News & Updates</h3>
                    <p className="text-muted-foreground">
                      Stay informed with the latest market news and analysis
                    </p>
                  </Card>

                  <Card className="glass-panel p-6">
                    <BarChart className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Performance</h3>
                    <p className="text-muted-foreground">
                      Track and analyze your portfolio performance
                    </p>
                  </Card>
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
