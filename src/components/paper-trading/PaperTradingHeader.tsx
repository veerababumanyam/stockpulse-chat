
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatting";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { ChartLine, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

export const PaperTradingHeader = () => {
  const { portfolioValue, todayChange, totalReturn } = usePaperTrading();
  const isPositiveDay = todayChange >= 0;
  const isPositiveTotal = totalReturn >= 0;

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Paper Trading</h1>
      <p className="text-muted-foreground">
        Practice trading without risking real money. Your paper trading account starts with $100,000 virtual cash.
      </p>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paper Account Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(portfolioValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Change</CardTitle>
            <ChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositiveDay ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveDay ? (
                <ArrowUp className="inline h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="inline h-4 w-4 mr-1" />
              )}
              {formatPrice(Math.abs(todayChange))} ({(todayChange / (portfolioValue - todayChange) * 100).toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <ChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositiveTotal ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveTotal ? (
                <ArrowUp className="inline h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="inline h-4 w-4 mr-1" />
              )}
              {formatPrice(Math.abs(totalReturn))} ({totalReturn / 1000}%)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
