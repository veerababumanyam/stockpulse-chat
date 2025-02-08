
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsAnalysisAgent } from "@/agents/NewsAnalysisAgent";
import { RefreshCw, TrendingUp, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsItem, TopicCount } from "./types";
import { analyzeTopics } from "./utils";
import { NewsItemComponent } from "./NewsItem";
import { TopicItem } from "./TopicItem";

export const MarketNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);
  const [topTopics, setTopTopics] = useState<TopicCount[]>([]);
  const [selectedTab, setSelectedTab] = useState("news");
  const { toast } = useToast();

  const fetchNews = async (showToast = false) => {
    try {
      const analysis = await NewsAnalysisAgent.analyze('SPY');
      const newsData = analysis.analysis.keyHighlights || [];
      setNews(newsData);
      setTopTopics(analyzeTopics(newsData));
      if (showToast) {
        toast({
          title: "News Updated",
          description: "Latest market news has been loaded",
        });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch market news",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNews(true);
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>AI-Analyzed Market News</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news">
              <TrendingUp className="h-4 w-4 mr-2" />
              Latest News
            </TabsTrigger>
            <TabsTrigger value="topics">
              <Hash className="h-4 w-4 mr-2" />
              Top Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4">
            {news.slice(0, displayCount).map((item, index) => (
              <NewsItemComponent key={index} item={item} />
            ))}
            {news.length > 5 && displayCount === 5 && (
              <Button
                variant="link"
                className="w-full mt-2"
                onClick={() => setDisplayCount(news.length)}
              >
                View All News
              </Button>
            )}
            {displayCount > 5 && (
              <Button
                variant="link"
                className="w-full mt-2"
                onClick={() => setDisplayCount(5)}
              >
                Show Less
              </Button>
            )}
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            {topTopics.map((topic, index) => (
              <TopicItem key={index} topic={topic} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
