
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Stock, WatchlistStock } from "@/types/watchlist";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { StockAlertsDialog } from "./StockAlertsDialog";
import { StockTableHeader } from "./table/StockTableHeader";
import { StockTableRow } from "./table/StockTableRow";
import { StockTableFilter } from "./table/StockTableFilter";

interface WatchlistTableProps {
  stocks: Stock[];
  isLoading: boolean;
  theme: 'light' | 'dark';
}

type SortConfig = {
  key: keyof Stock | '';
  direction: 'asc' | 'desc';
};

const convertToWatchlistStock = (stock: Stock): WatchlistStock => ({
  ...stock,
  price: 0,
  change: 0,
  changePercent: 0,
  marketCap: 0,
  volume: 0,
  sector: '',
  alerts: []
});

export const WatchlistTable = ({ stocks, isLoading, theme }: WatchlistTableProps) => {
  const { removeFromWatchlist, createAlert, deleteAlert } = useWatchlist();
  const [filterValue, setFilterValue] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [selectedStock, setSelectedStock] = useState<WatchlistStock | null>(null);

  const handleSort = (key: keyof Stock) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    if (filterValue) {
      const lowerFilter = filterValue.toLowerCase();
      result = result.filter(stock => 
        stock.symbol.toLowerCase().includes(lowerFilter) ||
        stock.companyName.toLowerCase().includes(lowerFilter)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
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

  return (
    <div className="space-y-4">
      <StockTableFilter 
        value={filterValue} 
        onChange={setFilterValue} 
      />

      <div className="overflow-x-auto">
        <Table>
          <StockTableHeader onSort={handleSort} />
          <TableBody>
            {filteredAndSortedStocks.map((stock) => {
              const watchlistStock = convertToWatchlistStock(stock);
              return (
                <StockTableRow
                  key={stock.symbol}
                  stock={watchlistStock}
                  onRemove={removeFromWatchlist}
                  onSelectStock={setSelectedStock}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedStock && (
        <StockAlertsDialog
          stock={selectedStock}
          open={!!selectedStock}
          onOpenChange={(open) => !open && setSelectedStock(null)}
          onAddAlert={(symbol: string, price: number, type: 'above' | 'below') => {
            createAlert({ symbol, targetPrice: price, type });
          }}
          onRemoveAlert={deleteAlert}
        />
      )}
    </div>
  );
};
