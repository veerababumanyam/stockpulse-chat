
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { WatchlistStock } from "@/types/watchlist";

export interface StockTableRowProps {
  stock: WatchlistStock;
  onRemove: (symbol: string) => void;
  onSelectStock: (stock: WatchlistStock) => void;
}

export const StockTableRow = ({ stock, onRemove, onSelectStock }: StockTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{stock.symbol}</TableCell>
      <TableCell>{stock.companyName}</TableCell>
      <TableCell className="text-right">
        ${stock.price.toFixed(2)}
        <span className="ml-2">
          {stock.changePercent > 0 ? (
            <ChevronUp className="inline h-4 w-4 text-green-500" />
          ) : (
            <ChevronDown className="inline h-4 w-4 text-red-500" />
          )}
        </span>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelectStock(stock)}
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(stock.symbol)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
