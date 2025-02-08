
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { NewsScraperAgent } from "@/agents/NewsScraperAgent";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockRecommendation {
  symbol: string;
  companyName?: string;
  recommendationType: string;
  analystName: string;
  source: string;
  targetPrice?: number;
  date: string;
}

interface AIAnalysis {
  symbol: string;
  confidence: number;
  sentiment: number;
  sources: number;
  recommendation: string;
  fundamentalScore?: number;
  technicalScore?: number;
  growthScore?: number;
}

export const AnalystInsights = () => {
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    try {
      // Get recommendations from multiple sources using NewsScraperAgent
      const recommendedStocks = new Set<string>();
      const allRecommendations: StockRecommendation[] = [];

      // Fetch data for major market indices to get top stocks
      const indices = ['SPY', 'QQQ', 'DIA', 'IWM'];
      
      for (const index of indices) {
        const scrapedNews = await NewsScraperAgent.analyze(index);
        if (scrapedNews.success && scrapedNews.analysis) {
          // Add recommended stocks to the set
          scrapedNews.analysis.recommendedStocks.forEach(stock => recommendedStocks.add(stock));
          
          // Add analyst recommendations
          if (scrapedNews.analysis.analystRecommendations) {
            scrapedNews.analysis.analystRecommendations.forEach(rec => {
              rec.recommendations.forEach(r => {
                allRecommendations.push({
                  symbol: rec.symbol,
                  recommendationType: r.recommendation,
                  analystName: r.analyst,
                  source: r.source,
                  targetPrice: r.targetPrice,
                  date: r.date
                });
              });
            });
          }
        }
      }

      setRecommendations(allRecommendations);
      return Array.from(recommendedStocks);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analyst recommendations",
        variant: "destructive",
      });
      return [];
    }
  };

  const analyzeStocks = async (stocks: string[]) => {
    const analysisResults: AIAnalysis[] = [];

    for (const symbol of stocks) {
      try {
        const aiAnalysis = await OrchestratorAgent.orchestrateAnalysis({
          quote: { symbol },
          profile: { companyName: symbol }
        });

        if (aiAnalysis && typeof aiAnalysis === 'object') {
          const results = (aiAnalysis as any).results;
          if (results) {
            const sentiment = results.get('sentiment')?.data;
            const fundamental = results.get('fundamental')?.data;
            const technical = results.get('technical')?.data;
            const growth = results.get('growthTrends')?.data;

            if (sentiment && fundamental && technical) {
              analysisResults.push({
                symbol,
                confidence: (sentiment.confidence || 0.5) * 100,
                sentiment: sentiment.score || 0,
                sources: sentiment.sourceCount || 1,
                recommendation: technical.signals?.overallSignal || 'HOLD',
                fundamentalScore: calculateScore(fundamental),
                technicalScore: calculateScore(technical),
                growthScore: growth ? calculateScore(growth) : undefined
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
      }
    }

    setAiAnalysis(analysisResults.sort((a, b) => b.confidence - a.confidence));
  };

  const calculateScore = (data: any): number => {
    if (!data) return 50;
    let score = 50;
    
    if (data.signals?.overallSignal) {
      switch (data.signals.overallSignal) {
        case 'STRONG BUY': score += 25; break;
        case 'BUY': score += 15; break;
        case 'SELL': score -= 15; break;
        case 'STRONG SELL': score -= 25; break;
      }
    }

    if (data.confidence) {
      score = (score + data.confidence) / 2;
    }

    return Math.min(100, Math.max(0, score));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const recommendedStocks = await fetchRecommendations();
    await analyzeStocks(recommendedStocks);
    setIsRefreshing(false);
    toast({
      title: "Updated",
      description: "Analysis has been refreshed",
    });
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const recommendedStocks = await fetchRecommendations();
        await analyzeStocks(recommendedStocks);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('BUY')) return 'text-green-500';
    if (recommendation.includes('SELL')) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment > 0.3) return 'bg-green-500/10 text-green-500';
    if (sentiment < -0.3) return 'bg-red-500/10 text-red-500';
    return 'bg-yellow-500/10 text-yellow-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score <= 30) return 'text-red-500';
    return 'text-yellow-500';
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted rounded w-3/4 mb-4" />
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded w-1/2" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Top Analyst Recommendations & AI Insights</CardTitle>
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
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">Analyst Recommendations</h4>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex flex-col space-y-2 pb-3 last:pb-0 last:border-b-0 border-b">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{rec.symbol}</span>
                    <Badge variant="outline" className={getRecommendationColor(rec.recommendationType)}>
                      {rec.recommendationType}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Analyst: {rec.analystName}</div>
                    <div>
                      {rec.targetPrice && <span>Target: ${rec.targetPrice} | </span>}
                      <span>{rec.source} | {rec.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">AI Analysis of Recommended Stocks</h4>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {aiAnalysis.map((analysis, index) => (
                <div key={index} className="flex flex-col space-y-2 pb-3 last:pb-0 last:border-b-0 border-b">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{analysis.symbol}</span>
                    <Badge variant="outline" className={getSentimentBadge(analysis.sentiment)}>
                      {analysis.recommendation}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className={getScoreColor(analysis.fundamentalScore ?? 0)}>
                      Fund: {analysis.fundamentalScore?.toFixed(1) ?? 'N/A'}
                    </div>
                    <div className={getScoreColor(analysis.technicalScore ?? 0)}>
                      Tech: {analysis.technicalScore?.toFixed(1) ?? 'N/A'}
                    </div>
                    <div className={getScoreColor(analysis.growthScore ?? 0)}>
                      Growth: {analysis.growthScore?.toFixed(1) ?? 'N/A'}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Confidence: {analysis.confidence.toFixed(1)}%</span>
                    <span>Sources: {analysis.sources}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

