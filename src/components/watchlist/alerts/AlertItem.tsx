
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Alert, WatchlistStock } from "@/types/watchlist";
import { formatPrice } from "@/utils/formatting";

interface AlertItemProps {
  alert: Alert;
  stock: WatchlistStock;
  onRemoveAlert: (alertId: string) => void;
}

export const AlertItem = ({ alert, stock, onRemoveAlert }: AlertItemProps) => {
  const getAlertStatusColor = (alert: Alert) => {
    if (alert.isTriggered) return "text-gray-400";
    const currentPrice = stock.price;
    if (alert.type === 'above') {
      return currentPrice >= alert.price ? "text-green-500" : "text-yellow-500";
    }
    return currentPrice <= alert.price ? "text-red-500" : "text-yellow-500";
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border">
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
        onClick={() => onRemoveAlert(alert.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
