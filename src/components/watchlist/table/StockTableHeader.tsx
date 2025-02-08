import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { WatchlistStock } from "@/types/watchlist";

interface StockTableHeaderProps {
  onSort: (key: keyof WatchlistStock) => void;
}

export const StockTableHeader = ({ onSort }: StockTableHeaderProps) => {
  const renderSortableHeader = (label: string, key: keyof WatchlistStock) => (
    <Button
      variant="ghost"
      onClick={() => onSort(key)}
      className="flex items-center gap-2"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
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
  );
};
