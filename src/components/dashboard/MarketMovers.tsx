
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
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-xl font-semibold">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${title.includes('Gainers') ? 'text-green-500' : 'text-red-500'}`} />
          {title}
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {stocks.map((stock) => (
          <div 
            key={stock.symbol} 
            className="flex items-center justify-between rounded-lg bg-card hover:bg-accent/50 p-3 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{stock.symbol}</span>
                <span className={`text-sm font-medium ${getPriceChangeColor(stock.changePercent)}`}>
                  {formatPercentage(stock.changePercent / 100)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                {stock.name}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-lg">{formatPrice(stock.price)}</div>
              <div className={`text-sm ${getPriceChangeColor(stock.changePercent)}`}>
                {stock.change > 0 ? '+' : ''}{formatPrice(stock.change)}
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
              <div className="h-6 bg-muted rounded w-1/3 mb-6" />
              <div className="space-y-6">
                {Array(5).fill(0).map((_, j) => (
                  <div key={j} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-20" />
                      <div className="h-4 bg-muted rounded w-32" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-16" />
                      <div className="h-4 bg-muted rounded w-12" />
                    </div>
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
