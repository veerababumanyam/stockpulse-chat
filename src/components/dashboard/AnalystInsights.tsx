
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AggregatorAgent } from "@/agents/AggregatorAgent";

interface AIAnalysis {
  summary: string;
  sentiment: string;
  riskLevel: string;
  technicalSignals: string[];
  fundamentalFactors: string[];
}

interface StockRecommendation {
  symbol: string;
  companyName: string;
  recommendation: string;
  targetPrice: number;
  currentPrice: number;
  analyst: string;
  date: string;
  confidence: number;
  sources: string[];
  aiAnalysis: AIAnalysis;
}

export const AnalystInsights = () => {
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    setIsRefreshing(true);
    try {
      const result = await AggregatorAgent.analyze();
      if (result.analysis.recommendations) {
        setRecommendations(result.analysis.recommendations);
        toast({
          title: "Updated",
          description: `Analyzed ${result.analysis.totalSourcesAnalyzed} sources for recommendations`,
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analyst recommendations",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('strong buy')) return 'bg-green-500/10 text-green-500';
    if (recommendation.toLowerCase().includes('buy')) return 'bg-green-400/10 text-green-400';
    if (recommendation.toLowerCase().includes('sell')) return 'bg-red-500/10 text-red-500';
    return 'bg-yellow-500/10 text-yellow-500';
  };

  const calculateUpside = (target: number, current: number) => {
    const upside = ((target - current) / current) * 100;
    return upside.toFixed(1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">AI-Enhanced Stock Recommendations</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchRecommendations}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md">
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

                <div className="mt-2 text-sm">
                  <div className="text-muted-foreground">
                    <span className="font-medium">AI Analysis:</span> {rec.aiAnalysis.summary}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{rec.aiAnalysis.sentiment}</Badge>
                    <Badge variant="secondary">{rec.aiAnalysis.riskLevel}</Badge>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  <span>{rec.analyst} • {new Date(rec.date).toLocaleDateString()}</span>
                  <div className="mt-1">
                    Sources: {rec.sources.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
