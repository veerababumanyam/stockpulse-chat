
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewsItem } from "./NewsItem";
import { TopicItem } from "./TopicItem";
import type { NewsItemType } from "./types";

export const MarketNews = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to view market news');
        }

        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('api_key, use_yahoo_backup')
          .eq('service', 'fmp')
          .single();

        if (apiKeyError || !apiKeyData?.api_key) {
          throw new Error('FMP API key not found. Please set up your API key in the API Keys page');
        }

        try {
          // Use the basic press releases endpoint instead
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/stock_news?limit=10&apikey=${apiKeyData.api_key}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch market news');
          }

          const data = await response.json();

          // Transform FMP data to our format
          const formattedNews = data.map((item: any) => ({
            id: item.id || Math.random().toString(),
            title: item.title,
            description: item.text,
            publishedAt: item.publishedDate,
            source: item.site,
            url: item.url,
            symbol: item.symbol,
            image: item.image || null
          }));

          setNews(formattedNews);
          setError(null);

        } catch (error) {
          console.error('Error fetching FMP news:', error);
          
          // If backup is enabled and FMP fails, use placeholder news
          if (apiKeyData.use_yahoo_backup) {
            const defaultNews = [
              {
                id: '1',
                title: 'Market news temporarily limited',
                description: 'Some features require a premium FMP subscription. Basic market news is still available.',
                publishedAt: new Date().toISOString(),
                source: 'System',
                url: '#',
                symbol: 'INFO',
                image: null
              }
            ];
            setNews(defaultNews);
            setError('Limited market news access. Some features require a premium subscription.');
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error in news fetch:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch market news');
        toast({
          title: "Limited News Access",
          description: "Some features require a premium FMP subscription.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market News</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Market News</span>
          {news.length > 0 && (
            <TopicItem topic={news[0].symbol} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="default">
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {news.map((item) => (
            <NewsItem key={item.id} news={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
