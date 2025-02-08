
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
        if (!savedKeys) throw new Error('API key not found');
        
        const { fmp } = JSON.parse(savedKeys);
        
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/quotes/index?apikey=${fmp}`
        );

        if (!response.ok) throw new Error('Failed to fetch indices');
        
        const data = await response.json();
        setIndices(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching indices:', error);
        toast({
          title: "Error",
          description: "Failed to fetch market indices",
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
                <div className="font-medium">${index.price.toFixed(2)}</div>
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
