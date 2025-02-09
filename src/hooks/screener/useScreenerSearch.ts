
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FilterOption, ScreenerResult } from "@/components/screener/types";

export const useScreenerSearch = (filters: FilterOption[]) => {
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (matchType: 'all' | 'any') => {
    try {
      setIsLoading(true);
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found. Please add your Financial Modeling Prep API key in settings.');
      }

      const { fmp } = JSON.parse(savedKeys);
      if (!fmp) {
        throw new Error('FMP API key not found. Please add your Financial Modeling Prep API key in settings.');
      }

      let baseUrl = 'https://financialmodelingprep.com/api/v3/stock-screener';
      const params = new URLSearchParams();
      params.append('apikey', fmp);
      params.append('matchType', matchType);

      filters.forEach(filter => {
        if (filter.values) {
          if (filter.type === 'range') {
            if (filter.values.min !== undefined) params.append(`${filter.id}Above`, filter.values.min.toString());
            if (filter.values.max !== undefined) params.append(`${filter.id}Below`, filter.values.max.toString());
          } else if (filter.values.value) {
            params.append(filter.id, filter.values.value.toString());
          }
        }
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch screener results');
      }

      const data = await response.json();
      
      const formattedResults: ScreenerResult[] = data.map((stock: any) => ({
        symbol: stock.symbol,
        companyName: stock.companyName,
        price: stock.price,
        change: stock.changesPercentage,
        sector: stock.sector,
        marketCap: stock.marketCap,
        beta: stock.beta,
        volume: stock.volume,
        atr: stock.atr,
        revenueGrowth: stock.revenueGrowth,
        eps: stock.eps,
        peg: stock.peg,
        roe: stock.roe
      }));

      setResults(formattedResults);
      toast({
        title: "Search completed",
        description: `Found ${formattedResults.length} stocks matching your criteria using ${matchType === 'all' ? 'ALL' : 'ANY'} filter match.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    results,
    isLoading,
    handleSearch,
  };
};
