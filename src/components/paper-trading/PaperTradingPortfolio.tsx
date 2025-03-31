
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatting";
import { PaperTradingPosition } from "@/types/paper-trading";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaperTradingPortfolioProps {
  portfolio: PaperTradingPosition[];
  isLoading: boolean;
  error: Error | null;
}

export const PaperTradingPortfolio = ({ 
  portfolio, 
  isLoading,
  error
}: PaperTradingPortfolioProps) => {
  const { placeSellOrder } = usePaperTrading();

  const handleSellAll = (symbol: string, shares: number) => {
    placeSellOrder(symbol, shares);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Avg. Cost</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Total Return</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                  Your paper trading portfolio is empty. Start trading by buying some stocks.
                </TableCell>
              </TableRow>
            ) : (
              portfolio.map((position) => {
                const isPositive = position.totalReturn >= 0;
                
                return (
                  <TableRow key={position.symbol}>
                    <TableCell className="font-medium">{position.symbol}</TableCell>
                    <TableCell>{position.shares}</TableCell>
                    <TableCell>{formatPrice(position.averageCost)}</TableCell>
                    <TableCell>{formatPrice(position.currentPrice)}</TableCell>
                    <TableCell>{formatPrice(position.currentValue)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1" />
                        )}
                        {formatPrice(Math.abs(position.totalReturn))} ({position.totalReturnPercentage.toFixed(2)}%)
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSellAll(position.symbol, position.shares)}
                      >
                        Sell All
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
