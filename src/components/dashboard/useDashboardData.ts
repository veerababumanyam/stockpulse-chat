
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchYahooQuotes } from "@/utils/yahooFinanceAPI";

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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('You must be logged in to view market data');
          setIsLoading(false);
          return;
        }

        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('api_key, use_yahoo_backup')
          .eq('service', 'fmp')
          .single();

        if (apiKeyError || !apiKeyData) {
          setHasApiKey(false);
          setIsLoading(false);
          return;
        }

        setHasApiKey(true);
        
        // Only fetch market data if we have an API key
        const fmp = apiKeyData.api_key;
        const useYahooBackup = apiKeyData.use_yahoo_backup ?? true;
        
        // Validate API key format
        if (fmp.startsWith('hf_')) {
          setError('Invalid API key format. Please provide a valid Financial Modeling Prep (FMP) API key.');
          setIsLoading(false);
          return;
        }

        try {
          // Try FMP first
          const [gainersResponse, losersResponse] = await Promise.all([
            fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${fmp}`),
            fetch(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${fmp}`)
          ]);

          // Handle FMP errors
          const gainersData = await gainersResponse.json();
          const losersData = await losersResponse.json();

          if (!gainersResponse.ok || !losersResponse.ok) {
            // Check for suspension
            if (gainersData?.["Error Message"]?.includes("suspended") || 
                losersData?.["Error Message"]?.includes("suspended")) {
              console.log('FMP account suspended, falling back to Yahoo Finance');
              if (useYahooBackup) {
                // Fallback to Yahoo Finance
                const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];
                const yahooData = await fetchYahooQuotes(defaultSymbols);
                
                if (yahooData?.quoteResponse?.result) {
                  const quotes = yahooData.quoteResponse.result
                    .map((quote: any) => ({
                      symbol: quote.symbol,
                      name: quote.shortName || quote.longName || quote.symbol,
                      price: quote.regularMarketPrice,
                      change: quote.regularMarketChange,
                      changePercent: quote.regularMarketChangePercent
                    }))
                    .sort((a: StockData, b: StockData) => b.changePercent - a.changePercent);

                  const mid = Math.floor(quotes.length / 2);
                  setTopGainers(quotes.slice(0, mid));
                  setTopLosers(quotes.slice(mid).reverse());
                  setError(null);
                  return;
                }
              }
              throw new Error('Your FMP API key has been suspended. Please contact FMP support at info@financialmodelingprep.com for details.');
            }
            throw new Error('Failed to fetch market data. Please check your API key status.');
          }

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
