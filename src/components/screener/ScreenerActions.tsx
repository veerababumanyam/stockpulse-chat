
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface ScreenerActionsProps {
  isLoading: boolean;
  onSearch: () => void;
}

const ScreenerActions = ({ isLoading, onSearch }: ScreenerActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        className="bg-background/50 backdrop-blur-sm border-border/50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Custom Filter
      </Button>

      <Button
        onClick={onSearch}
        disabled={isLoading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : null}
        Search Stocks
      </Button>
    </div>
  );
};

export default ScreenerActions;

