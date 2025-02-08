
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatPercentage, getPriceChangeColor } from "@/utils/formatting";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketMoversProps {
  gainers: StockData[];
  losers: StockData[];
  isLoading: boolean;
}

const MarketMoverCard = ({ title, stocks, icon: Icon }: { 
  title: string;
  stocks: StockData[];
  icon: any;
}) => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xl font-bold">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-muted-foreground">{stock.name}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatPrice(stock.price)}</div>
              <div className={getPriceChangeColor(stock.changePercent)}>
                {formatPercentage(stock.changePercent / 100)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const MarketMovers = ({ gainers, losers, isLoading }: MarketMoversProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, i) => (
          <Card key={i} className="h-[400px] animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-4" />
              <div className="space-y-4">
                {Array(5).fill(0).map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
