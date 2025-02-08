
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatting";
import { ChartLine, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

export const Overview = () => {
  // TODO: Replace with actual portfolio data
  const portfolioValue = 100000;
  const todayChange = 1234.56;
  const totalReturn = 12.34;
  const isPositiveDay = todayChange >= 0;
  const isPositiveTotal = totalReturn >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
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
            {formatPrice(Math.abs(todayChange))}
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
            {totalReturn}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
