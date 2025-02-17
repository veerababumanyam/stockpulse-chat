
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EconomicEvent {
  event: string;
  date: string;
  country: string;
  actual?: string;
  previous?: string;
  impact: string;
}

export const EconomicCalendar = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEconomicData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to view economic data');
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
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/economic_calendar?apikey=${apiKeyData.api_key}`
          );

          const data = await response.json();

          if (!response.ok) {
            // Handle premium endpoint restriction
            if (data?.["Error Message"]?.includes("Exclusive Endpoint")) {
              if (apiKeyData.use_yahoo_backup) {
                // Use basic placeholder data when premium endpoint is not available
                const placeholderData = [
                  {
                    event: "Economic data temporarily unavailable",
                    date: new Date().toISOString(),
                    country: "US",
                    impact: "Medium"
                  }
                ];
                setEvents(placeholderData);
                setError("Premium economic data not available. Please upgrade your FMP subscription for full access.");
                return;
              }
              throw new Error('This feature requires a premium FMP subscription');
            }
            throw new Error('Failed to fetch economic data');
          }

          const formattedEvents = data
            .slice(0, 5)
            .map((event: any) => ({
              event: event.event,
              date: event.date,
              country: event.country,
              actual: event.actual,
              previous: event.previous,
              impact: event.impact
            }));

          setEvents(formattedEvents);
          setError(null);

        } catch (error) {
          console.error('Error fetching economic data:', error);
          if (apiKeyData.use_yahoo_backup) {
            // Fallback to basic data
            const basicData = [
              {
                event: "Economic data temporarily unavailable",
                date: new Date().toISOString(),
                country: "US",
                impact: "Medium"
              }
            ];
            setEvents(basicData);
            setError("Economic data temporarily unavailable. Using backup data source.");
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error in economic data fetch:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch economic data');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch economic data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEconomicData();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Economic Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Economic Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Economic Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={`${event.event}-${event.date}-${index}`}
              className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg"
            >
              <div>
                <div className="font-medium">{event.event}</div>
                <div className="text-sm text-muted-foreground">{event.country}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                {event.actual && (
                  <div className="text-sm text-muted-foreground">
                    Actual: {event.actual}
                  </div>
                )}
                {event.previous && (
                  <div className="text-sm text-muted-foreground">
                    Previous: {event.previous}
                  </div>
                )}
                <div className={`text-xs ${
                  event.impact === 'High' ? 'text-red-500' :
                  event.impact === 'Medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {event.impact} Impact
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
