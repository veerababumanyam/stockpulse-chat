
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateScreeningCriteria } from "@/utils/aiScreener";
import { fetchStockScreenerResults } from "@/utils/stockApi";
import { ScreenerResult } from "../types";

interface AISearchSectionProps {
  onResultsFound: (results: ScreenerResult[]) => void;
}

const AISearchSection = ({ onResultsFound }: AISearchSectionProps) => {
  const [aiQuery, setAiQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAISearch = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Please enter a query",
        description: "Describe what kind of stocks you're looking for",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const criteria = await generateScreeningCriteria(aiQuery);
      console.log("Generated criteria:", criteria);

      if (criteria.length === 0) {
        toast({
          title: "No criteria found",
          description: "Please try rephrasing your query with more specific requirements",
          variant: "destructive"
        });
        return;
      }

      const screeningResults = await fetchStockScreenerResults(criteria);
      console.log("Screening results:", screeningResults);

      const formattedResults: ScreenerResult[] = screeningResults.map((stock: any) => ({
        symbol: stock.symbol,
        companyName: stock.companyName || stock.name,
        price: stock.price,
        change: stock.changesPercentage || 0,
        sector: stock.sector || 'N/A',
        marketCap: stock.marketCap || 0,
        volume: stock.volume || 0,
        beta: stock.beta || 0,
        atr: stock.atr || 0,
        revenueGrowth: stock.revenueGrowth || 0,
        eps: stock.eps || 0,
        peg: stock.peg || 0,
        roe: stock.roe || 0
      }));

      onResultsFound(formattedResults);

      if (formattedResults.length === 0) {
        toast({
          title: "No matches found",
          description: "No stocks match your criteria. Try adjusting your requirements.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${formattedResults.length} stocks matching your criteria`,
        });
      }
    } catch (error: any) {
      console.error("AI Screener error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold">AI Stock Screener</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Describe the stocks you want to find in natural language
          </p>
          <div className="flex gap-3">
            <Input
              placeholder="Example: Show me high growth tech stocks with strong profitability"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAISearch}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Search Stocks
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AISearchSection;
