
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

const defaultIndices = [
  { symbol: 'SPY', name: 'S&P 500 ETF' },
  { symbol: 'DIA', name: 'Dow Jones ETF' },
  { symbol: 'QQQ', name: 'Nasdaq ETF' },
  { symbol: 'IWM', name: 'Russell 2000 ETF' },
];

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

        // Use basic quote endpoint instead of premium index endpoint
        const promises = defaultIndices.map(index =>
          fetch(`https://financialmodelingprep.com/api/v3/quote/${index.symbol}?apikey=${apiKeyData.api_key}`)
            .then(res => res.json())
            .then(data => ({
              symbol: index.symbol,
              name: index.name,
              price: data[0]?.price || 0,
              change: data[0]?.change || 0,
              changePercent: data[0]?.changesPercentage || 0
            }))
            .catch(() => ({
              symbol: index.symbol,
              name: index.name,
              price: 0,
              change: 0,
              changePercent: 0
            }))
        );

        const results = await Promise.all(promises);
        setIndices(results);

      } catch (error) {
        console.error('Error fetching indices:', error);
        toast({
          title: "Market Data Limited",
          description: "Using basic market data.",
          variant: "default",
        });
        
        setIndices(defaultIndices.map(index => ({
          symbol: index.symbol,
          name: index.name,
          price: 0,
          change: 0,
          changePercent: 0
        })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndices();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Indices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                </div>
              </div>
            ))}
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
