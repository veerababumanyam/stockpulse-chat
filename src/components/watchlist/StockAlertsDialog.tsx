
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellPlus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Alert, WatchlistStock } from "@/hooks/useWatchlist";
import { formatPrice } from "@/utils/formatting";

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
  const [newAlertPrice, setNewAlertPrice] = useState("");
  const [newAlertType, setNewAlertType] = useState<'above' | 'below'>('above');

  const handleAddAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (!isNaN(price) && price > 0) {
      onAddAlert(stock.symbol, price, newAlertType);
      setNewAlertPrice("");
    }
  };

  const getAlertStatusColor = (alert: Alert) => {
    if (alert.isTriggered) return "text-gray-400";
    const currentPrice = stock.price;
    if (alert.type === 'above') {
      return currentPrice >= alert.price ? "text-green-500" : "text-yellow-500";
    }
    return currentPrice <= alert.price ? "text-red-500" : "text-yellow-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Price Alerts for {stock.symbol}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price..."
              value={newAlertPrice}
              onChange={(e) => setNewAlertPrice(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => setNewAlertType(newAlertType === 'above' ? 'below' : 'above')}
            >
              {newAlertType === 'above' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
            <Button onClick={handleAddAlert}>
              <BellPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {stock.alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  {alert.type === 'above' ? (
                    <ArrowUp className={`h-4 w-4 ${getAlertStatusColor(alert)}`} />
                  ) : (
                    <ArrowDown className={`h-4 w-4 ${getAlertStatusColor(alert)}`} />
                  )}
                  <span>{formatPrice(alert.price)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveAlert(stock.symbol, alert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

