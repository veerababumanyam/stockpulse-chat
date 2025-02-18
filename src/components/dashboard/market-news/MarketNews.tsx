
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
          // Use basic stock news endpoint instead of premium one
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/stock/actives?apikey=${apiKeyData.api_key}`
          );

          if (!response.ok) {
            const basicResponse = await fetch(
              `https://financialmodelingprep.com/api/v3/stock_market/gainers?limit=10&apikey=${apiKeyData.api_key}`
            );

            if (!basicResponse.ok) {
              throw new Error('Failed to fetch market news');
            }

            const data = await basicResponse.json();
            const formattedNews = data.map((item: any, index: number) => ({
              id: index.toString(),
              title: `${item.symbol} shows notable market movement`,
              description: `${item.companyName} (${item.symbol}) changed by ${item.changesPercentage?.toFixed(2)}%`,
              publishedAt: new Date().toISOString(),
              source: 'Market Data',
              url: '#',
              symbol: item.symbol,
              image: null
            }));

            setNews(formattedNews);
            setError("Using basic market data. Some features require a premium subscription.");
            return;
          }

          const data = await response.json();
          const formattedNews = data.map((item: any, index: number) => ({
            id: index.toString(),
            title: `Active Stock: ${item.symbol}`,
            description: `${item.companyName} (${item.symbol}) - Price: $${item.price?.toFixed(2)}`,
            publishedAt: new Date().toISOString(),
            source: 'Market Data',
            url: '#',
            symbol: item.symbol,
            image: null
          }));

          setNews(formattedNews);
          setError(null);

        } catch (error) {
          console.error('Error fetching news:', error);
          
          // Provide basic market information as fallback
          const fallbackNews = [{
            id: '1',
            title: 'Market Update',
            description: 'Basic market information available. Premium features require subscription.',
            publishedAt: new Date().toISOString(),
            source: 'System',
            url: '#',
            symbol: 'INFO',
            image: null
          }];
          
          setNews(fallbackNews);
          setError('Limited market news access. Some features require a premium subscription.');
        }
      } catch (error) {
        console.error('Error in news fetch:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch market news');
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
