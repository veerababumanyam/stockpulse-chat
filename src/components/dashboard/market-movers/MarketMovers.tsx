
import { TrendingUp, TrendingDown } from "lucide-react";
import { MarketMoversProps } from "./types";
import { MarketMoverCard } from "./MarketMoverCard";
import { LoadingState } from "./LoadingState";

export const MarketMovers = ({ gainers, losers, isLoading }: MarketMoversProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MarketMoverCard 
        title="Top Gainers" 
        stocks={gainers} 
        icon={TrendingUp}
      />
      <MarketMoverCard 
        title="Top Losers" 
        stocks={losers} 
        icon={TrendingDown}
      />
    </div>
  );
};

