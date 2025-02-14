
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const useDashboardData = () => {
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
          const errorMessage = 'Your FMP API key appears to be invalid or suspended. Please check your API key status at financialmodelingprep.com';
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

  return {
    hasApiKey,
    topGainers,
    topLosers,
    isLoading,
    error
  };
};

