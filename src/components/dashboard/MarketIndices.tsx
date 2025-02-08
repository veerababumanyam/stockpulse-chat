
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
        const savedKeys = localStorage.getItem('apiKeys');
        console.log('Saved API keys:', savedKeys);
        
        if (!savedKeys) {
          console.error('API key not found in localStorage');
          throw new Error('API key not found');
        }
        
        const parsedKeys = JSON.parse(savedKeys);
        console.log('Parsed API keys:', parsedKeys);
        
        const { fmp } = parsedKeys;
        if (!fmp) {
          console.error('FMP API key not found in parsed keys');
          throw new Error('FMP API key not found');
        }

        console.log('Using FMP API key:', fmp.slice(0, 4) + '...');
        
        const url = `https://financialmodelingprep.com/api/v3/quotes/index?apikey=${fmp}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);

        if (!response.ok) {
          console.error('API response not OK:', response.status);
          throw new Error(`Failed to fetch indices: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw API response:', data);
        
        if (!Array.isArray(data)) {
          console.error('Received data is not an array:', data);
          throw new Error('Invalid data format');
        }

        // Filter for specific major indices
        const importantSymbols = ['^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX'];
        const filteredData = data.filter((index: any) => importantSymbols.includes(index?.symbol));
        console.log('Filtered indices:', filteredData);

        const validIndices = filteredData.map((index: any) => ({
          symbol: index.symbol,
          name: index.name || 'Unknown',
          price: Number(index.price) || 0,
          change: Number(index.change) || 0,
          changePercent: Number(index.changesPercentage) || 0
        }));

        console.log('Processed indices:', validIndices);
        setIndices(validIndices);
      } catch (error) {
        console.error('Error fetching indices:', error);
        toast({
          title: "Error",
          description: "Failed to fetch market indices. Please check your API key.",
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
