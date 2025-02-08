import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchStockData } from "@/utils/stockApi";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";

export interface WatchlistStock {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  sector: string;
  aiAnalysis?: {
    signal: string;
    targetPrice: number;
    target24Price: number;
    lastUpdated: string;
  };
  alerts?: {
    priceAbove?: number;
    priceBelow?: number;
    volumeAbove?: number;
  };
}

const STORAGE_KEY = 'watchlist-stocks';
const AI_ANALYSIS_KEY = 'watchlist-ai-analysis';
const UPDATE_INTERVAL = 60000; // 1 minute

export const useWatchlist = () => {
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadAIAnalysis = () => {
    try {
      const savedAnalysis = localStorage.getItem(AI_ANALYSIS_KEY);
      if (savedAnalysis) {
        return JSON.parse(savedAnalysis);
      }
    } catch (err) {
      console.error('Error loading AI analysis:', err);
    }
    return {};
  };

  const saveAIAnalysis = (analysis: Record<string, any>) => {
    try {
      localStorage.setItem(AI_ANALYSIS_KEY, JSON.stringify(analysis));
    } catch (err) {
      console.error('Error saving AI analysis:', err);
    }
  };

  const runAIAnalysis = async (stockData: any) => {
    try {
      const analysisResults = await OrchestratorAgent.orchestrateAnalysis(stockData);
      if (!analysisResults?.results?.fundamental?.analysis) {
        return null;
      }
      
      const signal = analysisResults.results.fundamental.analysis.summary?.recommendation || 'HOLD';
      const targetPrice = analysisResults.results.fundamental.analysis.pricePredictions?.twelveMonths?.price || 0;
      const target24Price = analysisResults.results.fundamental.analysis.pricePredictions?.twentyFourMonths?.price || 0;
      
      return {
        signal,
        targetPrice,
        target24Price,
        lastUpdated: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error running AI analysis:', err);
      return null;
    }
  };

  const shouldRunAnalysis = () => {
    const now = new Date();
    const marketOpen = new Date(now);
    marketOpen.setHours(9, 45, 0); // 15 minutes after market opens at 9:30
    const marketClose = new Date(now);
    marketClose.setHours(15, 45, 0); // 15 minutes before market closes at 16:00

    const isWeekday = now.getDay() > 0 && now.getDay() < 6;
    const isMarketHours = now >= marketOpen && now <= marketClose;

    return isWeekday && isMarketHours;
  };
  
  const loadStocks = async () => {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found. Please add your Financial Modeling Prep API key in settings.');
      }

      const { fmp } = JSON.parse(savedKeys);
      if (!fmp) {
        throw new Error('FMP API key not found. Please add your Financial Modeling Prep API key in settings.');
      }

      const savedSymbols = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const stocksData = await Promise.all(
        savedSymbols.map((symbol: string) => fetchStockData(symbol, fmp))
      );

      const existingAnalysis = loadAIAnalysis();
      const updatedAnalysis = { ...existingAnalysis };

      // Run AI analysis if needed
      if (shouldRunAnalysis()) {
        for (const data of stocksData) {
          const analysis = await runAIAnalysis(data);
          if (analysis) {
            updatedAnalysis[data.quote.symbol] = analysis;
          }
        }
        saveAIAnalysis(updatedAnalysis);
      }

      setStocks(stocksData.map(data => ({
        symbol: data.quote.symbol,
        companyName: data.profile.companyName,
        price: data.quote.price,
        change: data.quote.change,
        changePercent: data.quote.changesPercentage,
        marketCap: data.quote.marketCap,
        volume: data.quote.volume,
        sector: data.profile.sector,
        aiAnalysis: updatedAnalysis[data.quote.symbol]
      })));
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error loading watchlist",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
    const interval = setInterval(loadStocks, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

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

  return {
    stocks,
    isLoading,
    error,
    addStock,
    removeStock,
    exportData,
  };
};
