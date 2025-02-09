
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatPercentage, getPriceChangeColor } from "@/utils/formatting";
import { MarketMoverCardProps, StockData } from "./types";

export const MarketMoverCard = ({ title, stocks, icon: Icon }: MarketMoverCardProps) => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-xl font-semibold">
        <div className="flex items-center gap-2">
          <Icon 
            className={`h-5 w-5 ${
              title.includes('Gainers') ? 'text-green-500' : 'text-red-500'
            }`} 
          />
          {title}
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {stocks.map((stock: StockData) => (
          <div 
            key={stock.symbol} 
            className="flex items-center justify-between rounded-lg bg-card hover:bg-accent/50 p-4 transition-colors cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight">
                  {stock.symbol}
                </span>
                <span 
                  className={`text-sm font-medium ${getPriceChangeColor(stock.changePercent)} flex items-center gap-1`}
                >
                  {stock.changePercent > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {formatPercentage(stock.changePercent)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                {stock.name}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-lg">
                {formatPrice(stock.price)}
              </div>
              <div className={`text-sm ${getPriceChangeColor(stock.change)} flex items-center justify-end gap-1`}>
                {stock.change > 0 ? '+' : ''}
                {formatPrice(stock.change)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

