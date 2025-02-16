import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast"

export type Stock = {
  symbol: string;
  companyName: string;
};

export type Alert = {
  id?: number;
  symbol: string;
  targetPrice: number;
  triggered: boolean;
  createdAt?: string;
};

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast()

  useEffect(() => {
    fetchWatchlist();
    fetchAlerts();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to load watchlist",
          variant: "destructive",
        })
      }

      setWatchlist(data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        toast({
          title: "Error",
          description: "Failed to load alerts",
          variant: "destructive",
        })
      }

      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      })
    }
  };

  const addToWatchlist = async (stock: Stock) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .insert(stock);

      if (error) {
        console.error('Error adding to watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `${stock.companyName} added to watchlist`,
        })
        fetchWatchlist();
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive",
      })
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('symbol', symbol);

      if (error) {
        console.error('Error removing from watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to remove from watchlist",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Stock removed from watchlist`,
        })
        fetchWatchlist();
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      })
    }
  };

  const createAlert = async (alert: Omit<Alert, 'id' | 'triggered'>) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .insert({ ...alert, triggered: false });

      if (error) {
        console.error('Error creating alert:', error);
        toast({
          title: "Error",
          description: "Failed to create alert",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Alert created for ${alert.symbol}`,
        })
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      })
    }
  };

  const updateAlert = async (alert: Alert) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ ...alert })
        .eq('id', alert.id);

      if (error) {
        console.error('Error updating alert:', error);
        toast({
          title: "Error",
          description: "Failed to update alert",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Alert updated for ${alert.symbol}`,
        })
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      })
    }
  };

  const deleteAlert = async (id: number) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting alert:', error);
        toast({
          title: "Error",
          description: "Failed to delete alert",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Alert deleted`,
        })
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      })
    }
  };

  const handleAlertAction = async (alert: Alert) => {
    try {
      await updateAlert(alert);
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  return {
    watchlist,
    alerts,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    updateAlert,
    deleteAlert,
    handleAlertAction,
  };
};

export default useWatchlist;
