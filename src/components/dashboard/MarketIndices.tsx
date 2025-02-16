import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const MarketIndices = () => {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to view market data');
        }

        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('service', 'fmp')
          .single();

        if (apiKeyError || !apiKeyData) {
          throw new Error('FMP API key not found. Please set up your API key in the API Keys page');
        }

        const fmp = apiKeyData.api_key;
        
        const url = `https://financialmodelingprep.com/api/v3/quotes/index?apikey=${fmp}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch indices. Please check your API key status.');
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }

        // Filter for specific major indices
        const importantSymbols = ['^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX'];
        const filteredData = data.filter((index: any) => importantSymbols.includes(index?.symbol));

        const validIndices = filteredData.map((index: any) => ({
          symbol: index.symbol,
          name: index.name || 'Unknown',
          price: Number(index.price) || 0,
          change: Number(index.change) || 0,
          changePercent: Number(index.changesPercentage) || 0
        }));

        setIndices(validIndices);
      } catch (error) {
        console.error('Error fetching indices:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch market indices",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndices();
  }, [toast]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Market Indices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (indices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Indices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No market data available. Please check your API key configuration.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Indices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indices.map((index) => (
            <div key={index.symbol} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{index.symbol}</div>
                <div className="text-sm text-muted-foreground">{index.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ${index.price.toFixed(2)}
                </div>
                <div className={`text-sm flex items-center gap-1 ${
                  index.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {index.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {index.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
