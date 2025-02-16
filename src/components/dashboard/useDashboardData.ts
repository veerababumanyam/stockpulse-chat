
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const useDashboardData = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('You must be logged in to view market data');
          return;
        }

        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('service', 'fmp')
          .single();

        if (apiKeyError || !apiKeyData) {
          setHasApiKey(false);
          setError('FMP API key not found. Please set up your API key in the API Keys page');
          return;
        }

        setHasApiKey(true);
        const fmp = apiKeyData.api_key;

        if (fmp.startsWith('hf_')) {
          setError('Invalid API key format. Please provide a valid Financial Modeling Prep (FMP) API key. Visit https://site.financialmodelingprep.com/developer to get your API key.');
          return;
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
  }, [toast]);

  return {
    hasApiKey,
    topGainers,
    topLosers,
    isLoading,
    error
  };
};
