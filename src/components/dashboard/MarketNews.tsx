
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsAnalysisAgent } from "@/agents/NewsAnalysisAgent";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  title: string;
  text: string;
  date: string;
  source: string;
  url: string;
  sentiment: {
    score: number;
    magnitude: number;
  };
}

export const MarketNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const analysis = await NewsAnalysisAgent.analyze('SPY'); // Use SPY as a proxy for market news
        setNews(analysis.analysis.keyHighlights || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast({
          title: "Error",
          description: "Failed to fetch market news",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return "bg-green-500/10 text-green-500";
    if (sentiment < -0.3) return "bg-red-500/10 text-red-500";
    return "bg-yellow-500/10 text-yellow-500";
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.3) return "Positive";
    if (sentiment < -0.3) return "Negative";
    return "Neutral";
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
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
        <CardTitle>AI-Analyzed Market News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="pb-4 border-b last:border-b-0">
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-muted/50 rounded-lg p-2 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className={getSentimentColor(item.sentiment.score)}
                  >
                    {getSentimentLabel(item.sentiment.score)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {new Date(item.date).toLocaleDateString()} • {item.source}
                </div>
                <p className="text-sm line-clamp-2">{item.text}</p>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
