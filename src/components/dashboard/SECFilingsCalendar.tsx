
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LegalDocumentAgent } from "@/agents/LegalDocumentAgent";

interface Filing {
  type: string;
  date: string;
  title: string;
  link: string;
}

export const SECFilingsCalendar = () => {
  const [filings, setFilings] = useState<Filing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFilings = async () => {
      try {
        const result = await LegalDocumentAgent.analyze('SPY');
        if (result.analysis?.recentFilings) {
          setFilings(result.analysis.recentFilings.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching SEC filings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch SEC filings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilings();
  }, [toast]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>SEC Filings</CardTitle>
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
        <CardTitle>SEC Filings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filings.map((filing, index) => (
            <div key={index} className="pb-4 border-b last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{filing.type}</span>
                <span className="text-sm text-muted-foreground">
                  {filing.date}
                </span>
              </div>
              <a 
                href={filing.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {filing.title}
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
