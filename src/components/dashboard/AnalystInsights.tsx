
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AnalystRecommendationsAgent } from "@/agents/AnalystRecommendationsAgent";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
}

export const AnalystInsights = ({ symbol }: { symbol: string }) => {
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol, toast]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Analyst Insights</CardTitle>
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

  if (!analysisData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Analyst Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Consensus</h4>
            <div className={`text-lg font-bold ${
              analysisData.consensus.includes('BUY') ? 'text-green-500' :
              analysisData.consensus.includes('SELL') ? 'text-red-500' :
              'text-yellow-500'
            }`}>
              {analysisData.consensus}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Signal</h4>
            <div className="text-lg font-bold">
              {analysisData.signals.overallSignal}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Recommendations</h4>
          <div className="space-y-2">
            {Object.entries(analysisData.recommendations).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
