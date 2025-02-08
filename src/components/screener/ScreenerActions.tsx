
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Filter, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScreenerActionsProps {
  isLoading: boolean;
  onSearch: (matchType: 'all' | 'any') => void;
}

const ScreenerActions: React.FC<ScreenerActionsProps> = ({ isLoading, onSearch }) => {
  const [matchType, setMatchType] = React.useState<'all' | 'any'>('all');

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

