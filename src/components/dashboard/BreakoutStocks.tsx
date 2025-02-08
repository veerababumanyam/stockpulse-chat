
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BreakoutStocksAgent } from "@/agents/BreakoutStocksAgent";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

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
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing",
      description: "Updating breakout stocks data...",
    });
    await fetchBreakoutStocks();
  };

  useEffect(() => {
    fetchBreakoutStocks();
    const interval = setInterval(fetchBreakoutStocks, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [toast]);

  if (isLoading) {
    return (
      <Card className="animate-pulse h-full">
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
    <Card className="backdrop-blur-sm bg-card/95 shadow-lg transition-all duration-200 hover:shadow-xl border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Breakout Stocks
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {stocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <p className="text-muted-foreground">
                No breakout stocks detected at this time
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-4 backdrop-blur-sm bg-background/50 rounded-lg hover:bg-accent/30 transition-all duration-200 border border-border/50 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                    </div>
                    <Badge 
                      variant={stock.confidence >= 75 ? "default" : "secondary"}
                      className="animate-fade-in"
                    >
                      {stock.confidence}% Confidence
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stock.breakoutSignals.map((signal, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="bg-background/50 backdrop-blur-sm"
                      >
                        {signal}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm mt-2 font-medium">
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

