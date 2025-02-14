
import { TrendingUp, TrendingDown } from "lucide-react";
import { MarketMoversProps } from "./types";
import { MarketMoverCard } from "./MarketMoverCard";
import { LoadingState } from "./LoadingState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const MarketMovers = ({ gainers, losers, isLoading }: MarketMoversProps) => {
  const navigate = useNavigate();

  const handleUpdateApiKey = () => {
    navigate("/api-keys");
  };

  if (gainers.length === 0 && losers.length === 0 && !isLoading) {
    return (
      <Alert variant="destructive">
        <AlertTitle>API Key Error</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>Unable to fetch market data. Your FMP API key may be invalid or suspended.</p>
          <Button variant="outline" onClick={handleUpdateApiKey}>
            Update API Key
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

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

