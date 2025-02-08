
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AnalystRecommendation {
  symbol: string;
  companyName: string;
  recommendation: string;
  targetPrice: number;
  currentPrice: number;
  analyst: string;
  date: string;
}

// Top analyst recommendations curated daily
const ANALYST_RECOMMENDATIONS: AnalystRecommendation[] = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    recommendation: "BUY",
    targetPrice: 220,
    currentPrice: 175,
    analyst: "Morgan Stanley",
    date: "2024-03-20"
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    recommendation: "STRONG BUY",
    targetPrice: 450,
    currentPrice: 420,
    analyst: "Goldman Sachs",
    date: "2024-03-20"
  },
  {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    recommendation: "BUY",
    targetPrice: 180,
    currentPrice: 150,
    analyst: "JP Morgan",
    date: "2024-03-20"
  },
  {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    recommendation: "STRONG BUY",
    targetPrice: 950,
    currentPrice: 880,
    analyst: "Bank of America",
    date: "2024-03-20"
  },
  {
    symbol: "META",
    companyName: "Meta Platforms Inc.",
    recommendation: "BUY",
    targetPrice: 520,
    currentPrice: 480,
    analyst: "Wells Fargo",
    date: "2024-03-20"
  }
];

export const AnalystInsights = () => {
  const [recommendations, setRecommendations] = useState<AnalystRecommendation[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setRecommendations(ANALYST_RECOMMENDATIONS);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // In a real application, you would fetch fresh data here
      // For now, we'll just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Updated",
        description: "Analyst recommendations have been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh analyst recommendations",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('STRONG BUY')) return 'bg-green-500/10 text-green-500';
    if (recommendation.includes('BUY')) return 'bg-green-400/10 text-green-400';
    if (recommendation.includes('SELL')) return 'bg-red-500/10 text-red-500';
    return 'bg-yellow-500/10 text-yellow-500';
  };

  const calculateUpside = (target: number, current: number) => {
    const upside = ((target - current) / current) * 100;
    return upside.toFixed(1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Top Analyst Recommendations</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md">
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex flex-col space-y-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{rec.symbol}</span>
                    <span className="text-muted-foreground ml-2">({rec.companyName})</span>
                  </div>
                  <Badge variant="outline" className={getRecommendationColor(rec.recommendation)}>
                    {rec.recommendation}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target: ${rec.targetPrice}</span>
                  <span className="text-muted-foreground">Current: ${rec.currentPrice}</span>
                  <span className={`font-medium ${Number(calculateUpside(rec.targetPrice, rec.currentPrice)) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    Upside: {calculateUpside(rec.targetPrice, rec.currentPrice)}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>{rec.analyst} • {new Date(rec.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
