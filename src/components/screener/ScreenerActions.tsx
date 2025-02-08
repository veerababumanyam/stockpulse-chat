
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Filter, Save, Trash2, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { generateScreeningCriteria } from "@/utils/aiScreener";
import { fetchStockScreenerResults } from "@/utils/stockApi";

interface ScreenerActionsProps {
  isLoading: boolean;
  onSearch: (matchType: 'all' | 'any') => void;
}

const ScreenerActions: React.FC<ScreenerActionsProps> = ({ isLoading, onSearch }) => {
  const [matchType, setMatchType] = React.useState<'all' | 'any'>('all');
  const [showAIDialog, setShowAIDialog] = useState(false);
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
      
      setShowAIDialog(false);
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
    <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 sticky top-0 z-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={matchType}
            onValueChange={(value: 'all' | 'any') => setMatchType(value)}
          >
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Match Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Match All Filters (AND)</SelectItem>
              <SelectItem value="any">Match Any Filter (OR)</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
            <DialogTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      AI Screener
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Describe stocks you want to find</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Stock Screener</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Example: Show me high growth tech stocks with strong profitability"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                />
                <Button 
                  onClick={handleAISearch}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Search Stocks"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => onSearch(matchType)}
            disabled={isLoading}
            className="ml-auto w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Filter className="h-4 w-4 mr-2" />
            )}
            Find Stocks
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Custom Filter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Filter Set</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear All Filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default ScreenerActions;
