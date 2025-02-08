
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Trash2, Search, Bell } from "lucide-react";
import { useWatchlist, WatchlistStock } from "@/hooks/useWatchlist";
import { formatLargeNumber, formatPrice, getPriceChangeColor } from "@/utils/formatting";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { StockAlertsDialog } from "./StockAlertsDialog";

interface WatchlistTableProps {
  stocks: WatchlistStock[];
  isLoading: boolean;
  theme: 'light' | 'dark';
}

type SortConfig = {
  key: keyof WatchlistStock | '';
  direction: 'asc' | 'desc';
};

export const WatchlistTable = ({ stocks, isLoading, theme }: WatchlistTableProps) => {
  const { removeStock, addAlert, removeAlert } = useWatchlist();
  const [filterValue, setFilterValue] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [selectedStock, setSelectedStock] = useState<WatchlistStock | null>(null);

  const handleSort = (key: keyof WatchlistStock) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    // Filter
    if (filterValue) {
      const lowerFilter = filterValue.toLowerCase();
      result = result.filter(stock => 
        stock.symbol.toLowerCase().includes(lowerFilter) ||
        stock.companyName.toLowerCase().includes(lowerFilter) ||
        stock.sector.toLowerCase().includes(lowerFilter)
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested aiAnalysis properties
        if (sortConfig.key === 'aiAnalysis') {
          aValue = a.aiAnalysis?.signal || '';
          bValue = b.aiAnalysis?.signal || '';
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [stocks, filterValue, sortConfig]);

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

  const renderSortableHeader = (label: string, key: keyof WatchlistStock) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(key)}
      className="flex items-center gap-2"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter by symbol, company, or sector..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{renderSortableHeader('Symbol', 'symbol')}</TableHead>
              <TableHead>{renderSortableHeader('Company', 'companyName')}</TableHead>
              <TableHead className="text-right">{renderSortableHeader('Price', 'price')}</TableHead>
              <TableHead className="text-right">{renderSortableHeader('Change', 'change')}</TableHead>
              <TableHead className="text-right">{renderSortableHeader('Volume', 'volume')}</TableHead>
              <TableHead>{renderSortableHeader('Sector', 'sector')}</TableHead>
              <TableHead className="text-right">{renderSortableHeader('AI Signal', 'aiAnalysis')}</TableHead>
              <TableHead className="text-right">12M Target</TableHead>
              <TableHead className="text-right">24M Target</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStocks.map((stock) => (
              <TableRow key={stock.symbol}>
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
                      onClick={() => setSelectedStock(stock)}
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
                      onClick={() => removeStock(stock.symbol)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedStock && (
        <StockAlertsDialog
          stock={selectedStock}
          open={!!selectedStock}
          onOpenChange={(open) => !open && setSelectedStock(null)}
          onAddAlert={addAlert}
          onRemoveAlert={removeAlert}
        />
      )}
    </div>
  );
};

