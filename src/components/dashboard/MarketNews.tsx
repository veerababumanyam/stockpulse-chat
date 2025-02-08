
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsAnalysisAgent } from "@/agents/NewsAnalysisAgent";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface TopicCount {
  topic: string;
  count: number;
  sentiment: number;
}

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
      analyzeTopics(newsData);
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

  const analyzeTopics = (newsData: NewsItem[]) => {
    const topics = new Map<string, { count: number; totalSentiment: number }>();
    
    newsData.forEach(item => {
      // Extract keywords from title and text
      const words = (item.title + ' ' + item.text).toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 4 && !commonWords.includes(word));
      
      const uniqueWords = Array.from(new Set(words));
      uniqueWords.forEach(word => {
        const current = topics.get(word) || { count: 0, totalSentiment: 0 };
        topics.set(word, {
          count: current.count + 1,
          totalSentiment: current.totalSentiment + item.sentiment.score
        });
      });
    });

    const topicArray: TopicCount[] = Array.from(topics.entries())
      .map(([topic, { count, totalSentiment }]) => ({
        topic,
        count,
        sentiment: totalSentiment / count
      }))
      .filter(topic => topic.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopTopics(topicArray);
  };

  useEffect(() => {
    fetchNews();
  }, [toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNews(true);
  };

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

  const commonWords = ['about', 'after', 'again', 'their', 'there', 'these', 'would', 'could'];

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
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{topic.topic}</span>
                  <Badge variant="outline">
                    {topic.count} mentions
                  </Badge>
                </div>
                <Badge 
                  variant="secondary" 
                  className={getSentimentColor(topic.sentiment)}
                >
                  {getSentimentLabel(topic.sentiment)}
                </Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

