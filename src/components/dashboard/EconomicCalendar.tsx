
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EconomicEvent {
  event: string;
  date: string;
  impact: 'High' | 'Medium' | 'Low';
  forecast?: string;
  previous?: string;
}

export const EconomicCalendar = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to view economic data');
        }

        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('service', 'fmp')
          .single();

        if (apiKeyError || !apiKeyData) {
          throw new Error('FMP API key not found. Please set up your API key in the API Keys page');
        }

        // Validate API key format
        if (apiKeyData.api_key.startsWith('hf_')) {
          throw new Error('Invalid API key format. Please provide a valid Financial Modeling Prep (FMP) API key, not a Hugging Face key.');
        }
        
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/economic_calendar?apikey=${apiKeyData.api_key}`
        );

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 403 && data?.["Error Message"]?.includes("Exclusive Endpoint")) {
            throw new Error('The Economic Calendar feature requires a premium FMP subscription. Please upgrade your plan at financialmodelingprep.com');
          }
          throw new Error('Failed to fetch economic calendar. Please check your API key status.');
        }
        
        const data = await response.json();
        setEvents(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching economic calendar:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch economic calendar",
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
          <CardTitle>Economic Calendar</CardTitle>
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
        <CardTitle>Economic Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="pb-4 border-b last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{event.event}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  event.impact === 'High' ? 'bg-red-100 text-red-800' :
                  event.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.impact} Impact
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(event.date).toLocaleDateString()}
              </div>
              {(event.forecast || event.previous) && (
                <div className="text-sm mt-2">
                  {event.forecast && <span>Forecast: {event.forecast}</span>}
                  {event.forecast && event.previous && <span className="mx-2">|</span>}
                  {event.previous && <span>Previous: {event.previous}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
