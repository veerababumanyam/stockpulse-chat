
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ToastAction } from "@/components/ui/toast";
import { MarketMovers } from "@/components/dashboard/MarketMovers";
import { AnalystInsights } from "@/components/dashboard/AnalystInsights";
import { MarketNews } from "@/components/dashboard/market-news/MarketNews";
import { BreakoutStocks } from "@/components/dashboard/BreakoutStocks";
import { MarketIndices } from "@/components/dashboard/MarketIndices";
import { EconomicCalendar } from "@/components/dashboard/EconomicCalendar";
import { EarningsCalendar } from "@/components/dashboard/EarningsCalendar";
import { SECFilingsCalendar } from "@/components/dashboard/SECFilingsCalendar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const DashboardContent = () => {
  const [hasApiKey, setHasApiKey] = useState(() => {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (savedKeys) {
        const parsedKeys = JSON.parse(savedKeys);
        return !!parsedKeys.fmp;
      }
      return false;
    } catch (error) {
      console.error('Error checking API key:', error);
      return false;
    }
  });

  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!hasApiKey) return;
      
      try {
        const savedKeys = localStorage.getItem('apiKeys');
        if (!savedKeys) {
          setError('API key not found');
          throw new Error('API key not found');
        }
        
        const { fmp } = JSON.parse(savedKeys);
        if (!fmp) {
          setError('FMP API key not found');
          throw new Error('FMP API key not found');
        }
        
        const [gainersResponse, losersResponse] = await Promise.all([
          fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${fmp}`),
          fetch(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${fmp}`)
        ]);

        if (!gainersResponse.ok || !losersResponse.ok) {
          const errorMessage = `Failed to fetch market data: ${gainersResponse.status}, ${losersResponse.status}`;
          setError(errorMessage);
          throw new Error(errorMessage);
        }

        const gainersData = await gainersResponse.json();
        const losersData = await losersResponse.json();

        if (!Array.isArray(gainersData) || !Array.isArray(losersData)) {
          setError('Invalid data format received from API');
          throw new Error('Invalid data format received from API');
        }

        setTopGainers(gainersData.slice(0, 5));
        setTopLosers(losersData.slice(0, 5));
        setError(null);
      } catch (error) {
        console.error('Error fetching market data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch market data';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
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

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      <div className="pt-[72px]">
        <main className="px-4 py-6 md:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Market Overview
                </span>
              </h1>
              <p className="text-xl text-muted-foreground font-light animate-fade-in delay-100">
                Track market movements and get AI-powered insights
              </p>
            </div>

            {!hasApiKey ? (
              <div className="glass-panel rounded-lg p-8 backdrop-blur-xl border border-border/50 animate-fade-in">
                <p className="text-lg text-muted-foreground mb-6">
                  To access real-time market data and AI-powered analysis, you'll need to set up your API key first.
                </p>
                <button
                  onClick={handleSetupApiKey}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-all duration-200 hover:shadow-lg font-medium"
                >
                  Set up API Key
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <ErrorBoundary>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ErrorBoundary>
                      <MarketIndices />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <BreakoutStocks />
                    </ErrorBoundary>
                  </div>
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <MarketMovers 
                    gainers={topGainers}
                    losers={topLosers}
                    isLoading={isLoading}
                  />
                </ErrorBoundary>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ErrorBoundary>
                    <AnalystInsights />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <MarketNews />
                  </ErrorBoundary>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ErrorBoundary>
                    <EconomicCalendar />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <EarningsCalendar />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <SECFilingsCalendar />
                  </ErrorBoundary>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
};

export default Dashboard;

