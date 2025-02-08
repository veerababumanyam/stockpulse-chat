import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AnalystRecommendationsAgent } from "@/agents/AnalystRecommendationsAgent";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { NewsScraperAgent } from "@/agents/NewsScraperAgent";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalystRecommendation {
  analyst: string;
  source: string;
  recommendation: string;
  targetPrice?: number;
  date: string;
}

interface AnalystData {
  signals: {
    overallSignal: string;
  };
  recommendations: {
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
  };
  consensus: string;
  analystRecommendations?: AnalystRecommendation[];
}

interface AIRecommendation {
  symbol: string;
  confidence: number;
  sentiment: number;
  sources: number;
  recommendation: string;
  fundamentalScore?: number;
  technicalScore?: number;
  growthScore?: number;
}

export const AnalystInsights = ({ symbol = 'SPY' }: { symbol?: string }) => {
  const [analysisData, setAnalysisData] = useState<AnalystData>({
    signals: {
      overallSignal: 'HOLD'
    },
    recommendations: {
      strongBuy: 0,
      buy: 0,
      hold: 0,
      sell: 0,
      strongSell: 0
    },
    consensus: 'HOLD'
  });
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const scrapeAnalystRecommendations = async () => {
    try {
      const scrapedNews = await NewsScraperAgent.analyze(symbol);
      return scrapedNews;
    } catch (error) {
      console.error('Error scraping recommendations:', error);
      return null;
    }
  };

  const fetchAIAnalysis = async () => {
    try {
      const scrapedData = await scrapeAnalystRecommendations();
      if (!scrapedData || !scrapedData.success) {
        throw new Error('Failed to scrape recommendations');
      }

      const recommendations: AIRecommendation[] = [];
      const stocksToAnalyze = new Set([symbol]);

      if (scrapedData.analysis?.recommendedStocks) {
        scrapedData.analysis.recommendedStocks.forEach(sym => stocksToAnalyze.add(sym));
      }

      if (scrapedData.analysis?.analystRecommendations?.[0]) {
        setAnalysisData(prevData => ({
          ...prevData,
          analystRecommendations: scrapedData.analysis?.analystRecommendations[0].recommendations
        }));
      }

      for (const stockSymbol of stocksToAnalyze) {
        const aiAnalysis = await OrchestratorAgent.orchestrateAnalysis({
          quote: { symbol: stockSymbol },
          profile: { companyName: stockSymbol }
        });

        if (aiAnalysis && typeof aiAnalysis === 'object') {
          const results = (aiAnalysis as any).results;
          if (results) {
            const sentiment = results.get('sentiment')?.data;
            const fundamental = results.get('fundamental')?.data;
            const technical = results.get('technical')?.data;
            const growth = results.get('growthTrends')?.data;
            
            if (sentiment && fundamental && technical) {
              recommendations.push({
                symbol: stockSymbol,
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
      }

      setAiRecommendations(recommendations.sort((a, b) => b.confidence - a.confidence));
    } catch (error) {
      console.error('Error in AI analysis:', error);
      toast({
        title: "AI Analysis Error",
        description: "Failed to get AI-powered insights",
        variant: "destructive",
      });
    }
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

  const extractSymbolsFromNews = (news: any): string[] => {
    const symbols: string[] = [];
    const content = (news.title + ' ' + news.summary).toUpperCase();
    
    const matches = content.match(/\$[A-Z]{1,5}|[A-Z]{1,5}:/g) || [];
    matches.forEach(match => {
      const symbol = match.replace(/[$:]/g, '');
      if (symbol.length >= 2 && symbol.length <= 5) {
        symbols.push(symbol);
      }
    });
    
    return [...new Set(symbols)];
  };

  const fetchAnalysis = async () => {
    try {
      const analysis = await AnalystRecommendationsAgent.analyze(symbol);
      if (analysis.analysis) {
        setAnalysisData(prevData => ({
          ...prevData,
          ...analysis.analysis,
          recommendations: {
            ...prevData.recommendations,
            ...(analysis.analysis.recommendations || {})
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching analyst insights:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analyst insights",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAnalysis(), fetchAIAnalysis()]);
    setIsRefreshing(false);
    toast({
      title: "Updated",
      description: "Analysis has been refreshed",
    });
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([fetchAnalysis(), fetchAIAnalysis()]);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [symbol]);

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
        <CardTitle className="text-xl font-bold">AI-Enhanced Market Analysis</CardTitle>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Market Consensus</h4>
            <div className={`text-lg font-bold ${getRecommendationColor(analysisData.consensus)}`}>
              {analysisData.consensus}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Signal</h4>
            <div className={`text-lg font-bold ${getRecommendationColor(analysisData.signals.overallSignal)}`}>
              {analysisData.signals.overallSignal}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-3">Professional Recommendations</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              {Object.entries(analysisData.recommendations).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <Badge variant="secondary">{value}</Badge>
                </div>
              ))}
            </div>
            
            {analysisData.analystRecommendations && (
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Recent Analyst Updates</h5>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {analysisData.analystRecommendations.map((rec, index) => (
                    <div key={index} className="flex flex-col space-y-1 pb-3 last:pb-0 last:border-b-0 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">{rec.analyst}</span>
                        <Badge variant="outline" className={getRecommendationColor(rec.recommendation)}>
                          {rec.recommendation}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rec.targetPrice && <span>Target: ${rec.targetPrice} | </span>}
                        <span>{rec.source} | {rec.date}</span>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">AI-Analyzed Stock Recommendations</h4>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="flex flex-col space-y-2 pb-3 last:pb-0 last:border-b-0 border-b">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{rec.symbol}</span>
                    <Badge variant="outline" className={getSentimentBadge(rec.sentiment)}>
                      {rec.recommendation}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className={getScoreColor(rec.fundamentalScore ?? 0)}>
                      Fund: {rec.fundamentalScore?.toFixed(1) ?? 'N/A'}
                    </div>
                    <div className={getScoreColor(rec.technicalScore ?? 0)}>
                      Tech: {rec.technicalScore?.toFixed(1) ?? 'N/A'}
                    </div>
                    <div className={getScoreColor(rec.growthScore ?? 0)}>
                      Growth: {rec.growthScore?.toFixed(1) ?? 'N/A'}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Confidence: {rec.confidence.toFixed(1)}%</span>
                    <span>Sources: {rec.sources}</span>
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
