
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WatchlistStock } from "@/types/watchlist";
import { AlertInput } from "./alerts/AlertInput";
import { AlertsList } from "./alerts/AlertsList";

interface StockAlertsDialogProps {
  stock: WatchlistStock;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAlert: (symbol: string, price: number, type: 'above' | 'below') => void;
  onRemoveAlert: (symbol: string, alertId: string) => void;
}

export const StockAlertsDialog = ({
  stock,
  open,
  onOpenChange,
  onAddAlert,
  onRemoveAlert,
}: StockAlertsDialogProps) => {
  const handleAddAlert = (price: number, type: 'above' | 'below') => {
    onAddAlert(stock.symbol, price, type);
  };

  const handleRemoveAlert = (alertId: string) => {
    onRemoveAlert(stock.symbol, alertId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Price Alerts for {stock.symbol}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <AlertInput onAddAlert={handleAddAlert} />
          <AlertsList
            alerts={stock.alerts}
            stock={stock}
            onRemoveAlert={handleRemoveAlert}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
