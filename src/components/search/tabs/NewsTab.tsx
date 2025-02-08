
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Globe } from "lucide-react";

interface NewsItem {
  title: string;
  text: string;
  publishedDate: string;
  site: string;
  url: string;
  symbol: string;
}

export const NewsTab = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const symbol = searchParams.get('q');
        
        if (!symbol) {
          throw new Error('No symbol provided');
        }

        const savedKeys = localStorage.getItem('apiKeys');
        if (!savedKeys) {
          throw new Error('API keys not found');
        }

        const { fmp } = JSON.parse(savedKeys);
        if (!fmp) {
          throw new Error('FMP API key not found');
        }

        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);

        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=50&apikey=${fmp}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch news",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [location.search, toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
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
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {news.length === 0 ? (
            <p className="text-muted-foreground">No news available for this stock.</p>
          ) : (
            news.map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:bg-gray-50 dark:hover:bg-gray-800 -mx-4 px-4 py-2 rounded-lg transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2 text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.text.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {item.site}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(item.publishedDate).toLocaleDateString()}
                    </div>
                  </div>
                </a>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

