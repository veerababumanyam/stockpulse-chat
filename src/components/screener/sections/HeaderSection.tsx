
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HeaderSection = () => {
  return (
    <div className="flex justify-between items-center transition-all duration-300 hover:bg-accent/5 p-4 rounded-lg -mx-4">
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
              <Button variant="outline" size="icon" className="transition-transform duration-200 hover:scale-105">
                <RefreshCw className="h-4 w-4 transition-transform hover:rotate-180 duration-500" />
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
              <Button variant="outline" size="icon" className="transition-transform duration-200 hover:scale-105">
                <Download className="h-4 w-4 transition-transform hover:-translate-y-1 duration-200" />
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
              <Button variant="outline" size="icon" className="transition-transform duration-200 hover:scale-105">
                <Upload className="h-4 w-4 transition-transform hover:translate-y-1 duration-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import Filters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default HeaderSection;

