
import { useState } from "react";
import { Alert, WatchlistStock } from "@/types/watchlist";
import { useToast } from "@/components/ui/use-toast";

export const useWatchlistAlerts = (stocks: WatchlistStock[], setStocks: React.Dispatch<React.SetStateAction<WatchlistStock[]>>) => {
  const { toast } = useToast();

  const addAlert = (symbol: string, target_price: number, type: 'above' | 'below') => {
    const alert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      target_price,
      type,
      triggered: false,
      created_at: new Date().toISOString()
    };

    setStocks(current => {
      const newStocks = current.map(stock => {
        if (stock.symbol === symbol) {
          return {
            ...stock,
            alerts: [...stock.alerts, alert]
          };
        }
        return stock;
      });

      // Save alerts to localStorage
      const savedAlerts = JSON.parse(localStorage.getItem('watchlist-alerts') || '{}');
      savedAlerts[symbol] = newStocks.find(s => s.symbol === symbol)?.alerts || [];
      localStorage.setItem('watchlist-alerts', JSON.stringify(savedAlerts));

      return newStocks;
    });

    toast({
      title: "Alert added",
      description: `Alert set for ${symbol} at $${target_price}`,
    });
  };

  const removeAlert = (symbol: string, alertId: string) => {
    setStocks(current => {
      const newStocks = current.map(stock => {
        if (stock.symbol === symbol) {
          return {
            ...stock,
            alerts: stock.alerts.filter(alert => alert.id !== alertId)
          };
        }
        return stock;
      });

      // Update localStorage
      const savedAlerts = JSON.parse(localStorage.getItem('watchlist-alerts') || '{}');
      savedAlerts[symbol] = newStocks.find(s => s.symbol === symbol)?.alerts || [];
      localStorage.setItem('watchlist-alerts', JSON.stringify(savedAlerts));

      return newStocks;
    });

    toast({
      title: "Alert removed",
      description: `Alert removed for ${symbol}`,
    });
  };

  return { addAlert, removeAlert };
};
