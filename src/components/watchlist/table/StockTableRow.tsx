
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bell, Trash2 } from "lucide-react";
import { WatchlistStock } from "@/types/watchlist";
import { formatLargeNumber, formatPrice, getPriceChangeColor } from "@/utils/formatting";

interface StockTableRowProps {
  stock: WatchlistStock;
  onRemove: (symbol: string) => void;
  onSelectStock: (stock: WatchlistStock) => void;
  getSignalColor: (signal: string) => string;
}

export const StockTableRow = ({ 
  stock, 
  onRemove, 
  onSelectStock,
  getSignalColor 
}: StockTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{stock.symbol}</TableCell>
      <TableCell>{stock.companyName}</TableCell>
      <TableCell className="text-right">{formatPrice(stock.price)}</TableCell>
      <TableCell className={`text-right ${getPriceChangeColor(stock.change)}`}>
        {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
      </TableCell>
      <TableCell className="text-right">{formatLargeNumber(stock.volume)}</TableCell>
      <TableCell>{stock.sector}</TableCell>
      <TableCell className={`text-right font-medium ${getSignalColor(stock.aiAnalysis?.signal || 'HOLD')}`}>
        {stock.aiAnalysis?.signal || 'HOLD'}
      </TableCell>
      <TableCell className="text-right">
        {stock.aiAnalysis?.targetPrice ? formatPrice(stock.aiAnalysis.targetPrice) : 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        {stock.aiAnalysis?.target24Price ? formatPrice(stock.aiAnalysis.target24Price) : 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectStock(stock)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {stock.alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {stock.alerts.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(stock.symbol)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
