
import { Alert, WatchlistStock } from "@/types/watchlist";
import { AlertItem } from "./AlertItem";

interface AlertsListProps {
  alerts: Alert[];
  stock: WatchlistStock;
  onRemoveAlert: (alertId: string) => void;
}

export const AlertsList = ({ alerts, stock, onRemoveAlert }: AlertsListProps) => {
  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          stock={stock}
          onRemoveAlert={onRemoveAlert}
        />
      ))}
    </div>
  );
};
