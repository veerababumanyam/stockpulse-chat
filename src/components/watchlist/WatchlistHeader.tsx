
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Download, Plus } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useState } from "react";

interface WatchlistHeaderProps {
  onExport: () => void;
  onOpenAlerts: () => void;
}

export const WatchlistHeader = ({ onExport, onOpenAlerts }: WatchlistHeaderProps) => {
  const [symbol, setSymbol] = useState("");
  const { addToWatchlist } = useWatchlist();

  const handleAddStock = async () => {
    if (symbol) {
      await addToWatchlist(symbol.toUpperCase(), symbol.toUpperCase());
      setSymbol("");
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-2">Watchlist</h1>
        <p className="text-muted-foreground">
          Monitor your favorite stocks and set custom alerts
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <Input
            placeholder="Enter stock symbol..."
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full sm:w-40"
          />
          <Button onClick={handleAddStock}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onOpenAlerts}>
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
