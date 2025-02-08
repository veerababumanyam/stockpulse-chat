
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsAnalysisAgent } from "@/agents/NewsAnalysisAgent";

interface NewsItem {
  title: string;
  text: string;
  date: string;
  source: string;
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
        <CardTitle>Market News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="pb-4 border-b last:border-b-0">
              <h4 className="font-semibold mb-1">{item.title}</h4>
              <div className="text-sm text-muted-foreground mb-2">
                {new Date(item.date).toLocaleDateString()} • {item.source}
              </div>
              <p className="text-sm line-clamp-2">{item.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
