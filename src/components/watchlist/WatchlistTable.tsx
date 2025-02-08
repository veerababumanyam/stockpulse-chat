
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { useWatchlist, WatchlistStock } from "@/hooks/useWatchlist";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { StockAlertsDialog } from "./StockAlertsDialog";
import { StockTableHeader } from "./table/StockTableHeader";
import { StockTableRow } from "./table/StockTableRow";
import { StockTableFilter } from "./table/StockTableFilter";

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
            {filteredAndSortedStocks.map((stock) => (
              <StockTableRow
                key={stock.symbol}
                stock={stock}
                onRemove={removeStock}
                onSelectStock={setSelectedStock}
                getSignalColor={getSignalColor}
              />
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
