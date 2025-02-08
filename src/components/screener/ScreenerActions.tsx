
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Filter, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScreenerActionsProps {
  isLoading: boolean;
  onSearch: () => void;
}

const ScreenerActions = ({ isLoading, onSearch }: ScreenerActionsProps) => {
  return (
    <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
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

        <Button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Filter className="h-4 w-4 mr-2" />
          )}
          Find Stocks
        </Button>
      </div>
    </Card>
  );
};

export default ScreenerActions;
