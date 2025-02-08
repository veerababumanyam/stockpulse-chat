
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BreakoutStocksAgent } from "@/agents/BreakoutStocksAgent";

interface BreakoutStock {
  symbol: string;
  companyName: string;
  price: number;
  breakoutSignals: string[];
  confidence: number;
}

export const BreakoutStocks = () => {
  const [stocks, setStocks] = useState<BreakoutStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchBreakoutStocks = async () => {
      try {
        const analysis = await BreakoutStocksAgent.analyze();
        if (analysis.analysis?.stocks) {
          setStocks(analysis.analysis.stocks);
          setLastUpdated(analysis.analysis.lastUpdated);
        }
      } catch (error) {
        console.error('Error fetching breakout stocks:', error);
        toast({
          title: "Error",
          description: "Failed to fetch breakout stocks data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreakoutStocks();
    const interval = setInterval(fetchBreakoutStocks, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [toast]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Breakout Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Breakout Stocks</span>
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {stocks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No breakout stocks detected at this time
            </p>
          ) : (
            <div className="space-y-4">
              {stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{stock.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                    </div>
                    <Badge variant={stock.confidence >= 75 ? "default" : "secondary"}>
                      {stock.confidence}% Confidence
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stock.breakoutSignals.map((signal, index) => (
                      <Badge key={index} variant="outline">
                        {signal}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm mt-2">
                    Current Price: ${stock.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
