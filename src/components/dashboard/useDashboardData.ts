
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
    const checkApiKey = async () => {
      try {
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('service', 'fmp')
          .maybeSingle();

        if (apiKeyError) {
          console.error('Error fetching API key:', apiKeyError);
          setError('Failed to check API key status');
          setHasApiKey(false);
          setIsLoading(false);
          return;
        }

        if (!apiKeyData) {
          setHasApiKey(false);
          setIsLoading(false);
          return;
        }

        setHasApiKey(true);
        
        // Only fetch market data if we have an API key
        const fmp = apiKeyData.api_key;
        
        // Validate API key format
        if (fmp.startsWith('hf_')) {
          setError('Invalid API key format. Please provide a valid Financial Modeling Prep (FMP) API key.');
          setIsLoading(false);
          return;
        }

        try {
          const [gainersResponse, losersResponse] = await Promise.all([
            fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${fmp}`),
            fetch(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${fmp}`)
          ]);

          if (!gainersResponse.ok || !losersResponse.ok) {
            throw new Error('Your FMP API key appears to be invalid or suspended. Please check your API key status at financialmodelingprep.com');
          }

          const [gainersData, losersData] = await Promise.all([
            gainersResponse.json(),
            losersResponse.json()
          ]);

          setTopGainers(gainersData.slice(0, 5));
          setTopLosers(losersData.slice(0, 5));
          setError(null);
        } catch (error) {
          console.error('API request error:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch market data');
          setHasApiKey(false);
        }
      } catch (error) {
        console.error('Error checking API key:', error);
        setError(error instanceof Error ? error.message : 'Failed to check API key status');
      } finally {
        setIsLoading(false);
      }
    };

    checkApiKey();
  }, [toast]);

  return {
    hasApiKey,
    topGainers,
    topLosers,
    isLoading,
    error
  };
};
