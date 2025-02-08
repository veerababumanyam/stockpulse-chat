
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Trash2 } from "lucide-react";
import { useWatchlist, WatchlistStock } from "@/hooks/useWatchlist";
import { formatLargeNumber, formatPrice, getPriceChangeColor } from "@/utils/formatting";
import { Skeleton } from "@/components/ui/skeleton";

interface WatchlistTableProps {
  stocks: WatchlistStock[];
  isLoading: boolean;
  theme: 'light' | 'dark';
}

export const WatchlistTable = ({ stocks, isLoading, theme }: WatchlistTableProps) => {
  const { removeStock } = useWatchlist();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          Your watchlist is empty. Add stocks to start tracking them.
        </p>
      </div>
    );
  }

  const getSignalColor = (signal: string) => {
    switch (signal?.toUpperCase()) {
      case 'STRONG BUY':
      case 'BUY':
        return 'text-green-600';
      case 'STRONG SELL':
      case 'SELL':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead className="text-right">AI Signal</TableHead>
            <TableHead className="text-right">12M Target</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.companyName}</TableCell>
              <TableCell className="text-right">{formatPrice(stock.price)}</TableCell>
              <TableCell className={`text-right ${getPriceChangeColor(stock.change)}`}>
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </TableCell>
              <TableCell className="text-right">{formatLargeNumber(stock.marketCap)}</TableCell>
              <TableCell className="text-right">{formatLargeNumber(stock.volume)}</TableCell>
              <TableCell>{stock.sector}</TableCell>
              <TableCell className={`text-right font-medium ${getSignalColor(stock.aiAnalysis?.signal || 'HOLD')}`}>
                {stock.aiAnalysis?.signal || 'HOLD'}
              </TableCell>
              <TableCell className="text-right">
                {stock.aiAnalysis?.targetPrice ? formatPrice(stock.aiAnalysis.targetPrice) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStock(stock.symbol)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
