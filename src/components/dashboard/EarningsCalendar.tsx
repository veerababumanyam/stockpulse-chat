
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EarningsEvent {
  symbol: string;
  date: string;
  eps: number | null;
  revenue: number | null;
}

export const EarningsCalendar = () => {
  const [events, setEvents] = useState<EarningsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to view earnings data');
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
          // Try premium earnings calendar endpoint first
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/earning_calendar?apikey=${apiKeyData.api_key}`
          );

          if (!response.ok) {
            // Fallback to basic income statement endpoint
            const basicResponse = await fetch(
              `https://financialmodelingprep.com/api/v3/income-statement/AAPL?limit=1&apikey=${apiKeyData.api_key}`
            );

            if (!basicResponse.ok) {
              throw new Error('Failed to fetch earnings data');
            }

            const data = await basicResponse.json();
            const formattedEvents = data.map((event: any) => ({
              symbol: 'AAPL',
              date: event.date,
              eps: event.eps,
              revenue: event.revenue
            }));

            setEvents(formattedEvents);
            setError("Using basic earnings data. Some features require a premium subscription.");
            return;
          }

          const data = await response.json();
          const formattedEvents = data.slice(0, 10).map((event: any) => ({
            symbol: event.symbol,
            date: event.date,
            eps: event.eps,
            revenue: event.revenue
          }));

          setEvents(formattedEvents);
          setError(null);

        } catch (error) {
          console.error('Error fetching earnings:', error);
          if (apiKeyData.use_yahoo_backup) {
            const basicData = [
              {
                symbol: "INFO",
                date: new Date().toISOString().split('T')[0],
                eps: null,
                revenue: null
              }
            ];
            setEvents(basicData);
            setError("Basic earnings data available.");
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error in earnings fetch:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch earnings data');
        toast({
          title: "Earnings Data",
          description: "Using basic earnings information.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings Calendar</CardTitle>
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
        <CardTitle>Earnings Information</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="default">
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={`${event.symbol}-${event.date}-${index}`}
              className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg"
            >
              <div>
                <div className="font-medium">{event.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              {(event.eps !== null || event.revenue !== null) && (
                <div className="text-right">
                  {event.eps !== null && <div>EPS: ${event.eps.toFixed(2)}</div>}
                  {event.revenue !== null && (
                    <div className="text-sm text-muted-foreground">
                      Rev: ${(event.revenue / 1e6).toFixed(1)}M
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
