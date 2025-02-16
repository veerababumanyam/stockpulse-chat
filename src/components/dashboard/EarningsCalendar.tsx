
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EarningsEvent {
  symbol: string;
  date: string;
  eps: string;
  epsEstimated: string;
  revenue?: string;
  revenueEstimated?: string;
}

export const EarningsCalendar = () => {
  const [events, setEvents] = useState<EarningsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to view earnings data');
        }

        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('service', 'fmp')
          .single();

        if (apiKeyError || !apiKeyData) {
          throw new Error('FMP API key not found. Please set up your API key in the API Keys page');
        }

        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/earning_calendar?apikey=${apiKeyData.api_key}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch earnings calendar. Please check your API key status.');
        }
        
        const data = await response.json();
        setEvents(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching earnings calendar:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch earnings calendar",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Earnings Calendar</CardTitle>
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
        <CardTitle>Earnings Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="pb-4 border-b last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{event.symbol}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">EPS: </span>
                  {event.eps || 'N/A'} vs {event.epsEstimated || 'N/A'} est.
                </div>
                {event.revenue && (
                  <div>
                    <span className="text-muted-foreground">Rev: </span>
                    {event.revenue} vs {event.revenueEstimated || 'N/A'} est.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
