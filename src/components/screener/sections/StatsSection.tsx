
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsSectionProps {
  resultsCount: number;
}

const StatsSection = ({ resultsCount }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
      <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:bg-accent/5 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Stocks</p>
            <p className="text-2xl font-bold animate-fade-in">8,749</p>
          </div>
          <Info className="h-4 w-4 text-muted-foreground transition-opacity duration-200 hover:opacity-70" />
        </div>
      </Card>
      <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:bg-accent/5 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Filtered Results</p>
            <p className="text-2xl font-bold animate-fade-in">{resultsCount}</p>
          </div>
          <Info className="h-4 w-4 text-muted-foreground transition-opacity duration-200 hover:opacity-70" />
        </div>
      </Card>
      <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:bg-accent/5 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Markets Coverage</p>
            <p className="text-2xl font-bold animate-fade-in">US, EU, Asia</p>
          </div>
          <Info className="h-4 w-4 text-muted-foreground transition-opacity duration-200 hover:opacity-70" />
        </div>
      </Card>
      <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:bg-accent/5 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-2xl font-bold animate-fade-in">Live</p>
          </div>
          <Info className="h-4 w-4 text-muted-foreground transition-opacity duration-200 hover:opacity-70" />
        </div>
      </Card>
    </div>
  );
};

export default StatsSection;

