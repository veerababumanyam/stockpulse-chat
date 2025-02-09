
import { MarketMovers } from "./MarketMovers";
import { AnalystInsights } from "./AnalystInsights";
import { MarketNews } from "./market-news/MarketNews";
import { BreakoutStocks } from "./BreakoutStocks";
import { MarketIndices } from "./MarketIndices";
import { EconomicCalendar } from "./EconomicCalendar";
import { EarningsCalendar } from "./EarningsCalendar";
import { SECFilingsCalendar } from "./SECFilingsCalendar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface DashboardGridProps {
  gainers: any[];
  losers: any[];
  isLoading: boolean;
}

export const DashboardGrid = ({ gainers, losers, isLoading }: DashboardGridProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ErrorBoundary>
            <MarketIndices />
          </ErrorBoundary>
          <ErrorBoundary>
            <BreakoutStocks />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <MarketMovers 
          gainers={gainers}
          losers={losers}
          isLoading={isLoading}
        />
      </ErrorBoundary>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <AnalystInsights />
        </ErrorBoundary>
        <ErrorBoundary>
          <MarketNews />
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ErrorBoundary>
          <EconomicCalendar />
        </ErrorBoundary>
        <ErrorBoundary>
          <EarningsCalendar />
        </ErrorBoundary>
        <ErrorBoundary>
          <SECFilingsCalendar />
        </ErrorBoundary>
      </div>
    </div>
  );
};

