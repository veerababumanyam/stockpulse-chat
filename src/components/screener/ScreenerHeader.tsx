
import { Button } from "@/components/ui/button";
import { Info, Download, Upload, RefreshCw, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ScreenerHeader = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const { toast } = useToast();

  const handleAISearch = () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Please enter a query",
        description: "Describe what kind of stocks you're looking for",
      });
      return;
    }

    // TODO: Implement AI search logic
    toast({
      title: "AI Search",
      description: "This feature will be implemented soon",
    });
    setShowAIDialog(false);
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
          <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
            <DialogTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Brain className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Stock Screener</p>
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
                <Button onClick={handleAISearch} className="w-full">
                  Search Stocks
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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

