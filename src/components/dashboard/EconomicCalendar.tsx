
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
          // Use basic economic indicators endpoint instead
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/economic/gdp/US?apikey=${apiKeyData.api_key}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch economic data');
          }

          const data = await response.json();

          // Transform the data into our format
          const formattedEvents = [{
            event: "GDP Release",
            date: data[0]?.date || new Date().toISOString(),
            country: "US",
            actual: `${data[0]?.value}%`,
            previous: `${data[1]?.value}%`,
            impact: "High"
          }];

          setEvents(formattedEvents);
          setError(null);

        } catch (error) {
          console.error('Error fetching economic data:', error);
          if (apiKeyData.use_yahoo_backup) {
            // Use placeholder data
            const basicData = [
              {
                event: "Economic data temporarily limited",
                date: new Date().toISOString(),
                country: "US",
                impact: "Medium"
              }
            ];
            setEvents(basicData);
            setError("Economic data access limited. Some features require a premium subscription.");
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error in economic data fetch:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch economic data');
        toast({
          title: "Limited Access",
          description: "Some economic features require a premium FMP subscription.",
          variant: "default",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Economic Data</CardTitle>
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
                    Current: {event.actual}
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
