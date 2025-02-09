
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchStockData } from "@/utils/stockApi";
import { WatchlistStock } from "@/types/watchlist";
import { loadAIAnalysis, saveAIAnalysis, runAIAnalysis, shouldRunAnalysis } from "./watchlist/useAIAnalysis";
import { useWatchlistAlerts } from "./watchlist/useWatchlistAlerts";

const STORAGE_KEY = 'watchlist-stocks';
const UPDATE_INTERVAL = 60000; // 1 minute

export const useWatchlist = () => {
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { addAlert, removeAlert } = useWatchlistAlerts(stocks, setStocks);

  const loadStocks = async () => {
    try {
      setError(null);
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found. Please add your Financial Modeling Prep API key in settings.');
      }

      const { fmp } = JSON.parse(savedKeys);
      if (!fmp) {
        throw new Error('FMP API key not found. Please add your Financial Modeling Prep API key in settings.');
      }

      const savedSymbols = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      if (savedSymbols.length === 0) {
        setStocks([]);
        setIsLoading(false);
        return;
      }

      const stocksData = await Promise.allSettled(
        savedSymbols.map((symbol: string) => fetchStockData(symbol, fmp))
      );

      const validStocksData = stocksData
        .filter((result): result is PromiseFulfilledResult<any> => 
          result.status === 'fulfilled' && result.value && result.value.quote)
        .map(result => result.value);

      if (validStocksData.length === 0) {
        throw new Error('Failed to fetch stock data. Please try again later.');
      }

      const existingAnalysis = loadAIAnalysis();
      const updatedAnalysis = { ...existingAnalysis };

      // Run AI analysis if needed
      if (shouldRunAnalysis()) {
        for (const data of validStocksData) {
          try {
            if (data && data.quote) {
              const analysis = await runAIAnalysis(data);
              if (analysis) {
                updatedAnalysis[data.quote.symbol] = analysis;
              }
            }
          } catch (analysisError) {
            console.error('Error running AI analysis:', analysisError);
            // Continue with next stock if analysis fails for one
          }
        }
        saveAIAnalysis(updatedAnalysis);
      }

      const savedAlerts = JSON.parse(localStorage.getItem('watchlist-alerts') || '{}');

      const validStocks = validStocksData
        .filter(data => data && data.quote && data.profile)
        .map(data => ({
          symbol: data.quote.symbol,
          companyName: data.profile.companyName || data.quote.symbol,
          price: data.quote.price || 0,
          change: data.quote.change || 0,
          changePercent: data.quote.changesPercentage || 0,
          marketCap: data.quote.marketCap || 0,
          volume: data.quote.volume || 0,
          sector: data.profile.sector || 'N/A',
          aiAnalysis: updatedAnalysis[data.quote.symbol],
          alerts: savedAlerts[data.quote.symbol] || []
        }));

      setStocks(validStocks);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      toast({
        title: "Error loading watchlist",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addStock = async (symbol: string) => {
    try {
      const savedSymbols = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!savedSymbols.includes(symbol)) {
        savedSymbols.push(symbol);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSymbols));
        await loadStocks();
        toast({
          title: "Stock added",
          description: `${symbol} has been added to your watchlist.`,
        });
      }
    } catch (err) {
      toast({
        title: "Error adding stock",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const removeStock = async (symbol: string) => {
    try {
      const savedSymbols = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newSymbols = savedSymbols.filter((s: string) => s !== symbol);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSymbols));

      // Remove alerts for the stock
      const savedAlerts = JSON.parse(localStorage.getItem('watchlist-alerts') || '{}');
      delete savedAlerts[symbol];
      localStorage.setItem('watchlist-alerts', JSON.stringify(savedAlerts));

      await loadStocks();
      toast({
        title: "Stock removed",
        description: `${symbol} has been removed from your watchlist.`,
      });
    } catch (err) {
      toast({
        title: "Error removing stock",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    try {
      const csvContent = [
        ['Symbol', 'Company Name', 'Price', 'Change', 'Change %', 'Market Cap', 'Volume', 'Sector'],
        ...stocks.map(stock => [
          stock.symbol,
          stock.companyName,
          stock.price,
          stock.change,
          stock.changePercent,
          stock.marketCap,
          stock.volume,
          stock.sector
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watchlist-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Your watchlist has been exported as a CSV file.",
      });
    } catch (err) {
      toast({
        title: "Export failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadStocks();
    const interval = setInterval(loadStocks, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return {
    stocks,
    isLoading,
    error,
    addStock,
    removeStock,
    exportData,
    addAlert,
    removeAlert,
  };
};
