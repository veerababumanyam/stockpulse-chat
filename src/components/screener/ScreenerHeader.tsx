
import { Button } from "@/components/ui/button";
import { Info, Download, Upload, RefreshCw, Brain, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateScreeningCriteria } from "@/utils/aiScreener";
import { fetchStockScreenerResults } from "@/utils/stockApi";

const ScreenerHeader = () => {
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

      const results = await fetchStockScreenerResults(criteria);
      console.log("Screening results:", results);

      if (results.length === 0) {
        toast({
          title: "No matches found",
          description: "No stocks match your criteria. Try adjusting your requirements.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${results.length} stocks matching your criteria`,
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Stock Screener</h1>
          <p className="text-muted-foreground mt-2">
            Find high-potential stocks using advanced filters and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Results</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import Filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Stocks</p>
              <p className="text-2xl font-bold">8,749</p>
            </div>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Filtered Results</p>
              <p className="text-2xl font-bold">245</p>
            </div>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Markets Coverage</p>
              <p className="text-2xl font-bold">US, EU, Asia</p>
            </div>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-2xl font-bold">Live</p>
            </div>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScreenerHeader;

