
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast"
import { Stock } from '@/types/watchlist';

export interface Alert {
  id: string;
  symbol: string;
  target_price: number;
  triggered: boolean;
  created_at?: string;
  user_id?: string;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

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

      if (error) throw error;
      setWatchlist(data.map(item => ({
        symbol: item.symbol,
        companyName: item.company_name,
      })));
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError(err instanceof Error ? err : new Error('Failed to load watchlist'));
      toast({
        title: "Error",
        description: "Failed to load watchlist",
        variant: "destructive",
      });
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

      if (error) throw error;
      setAlerts(data.map(item => ({
        id: item.id,
        symbol: item.symbol,
        target_price: Number(item.target_price),
        triggered: item.triggered,
        created_at: item.created_at,
        user_id: item.user_id,
      })));
    } catch (err) {
      console.error('Error fetching alerts:', err);
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      });
    }
  };

  const addToWatchlist = async (symbol: string, companyName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('watchlist')
        .insert({
          symbol: symbol.toUpperCase(),
          company_name: companyName,
          user_id: user.id
        });

      if (error) throw error;
      toast({
        title: "Success",
        description: `${companyName} added to watchlist`,
      });
      await fetchWatchlist();
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('symbol', symbol);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Stock removed from watchlist`,
      });
      await fetchWatchlist();
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      });
    }
  };

  const createAlert = async (params: { symbol: string; targetPrice: number; type: 'above' | 'below' }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('alerts')
        .insert({
          symbol: params.symbol.toUpperCase(),
          target_price: params.targetPrice,
          type: params.type,
          triggered: false,
          user_id: user.id
        });

      if (error) throw error;
      toast({
        title: "Success",
        description: `Alert created for ${params.symbol}`,
      });
      await fetchAlerts();
    } catch (err) {
      console.error('Error creating alert:', err);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Alert deleted`,
      });
      await fetchAlerts();
    } catch (err) {
      console.error('Error deleting alert:', err);
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const data = {
      watchlist,
      alerts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watchlist-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    watchlist,
    alerts,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    deleteAlert,
    exportData,
  };
};

export default useWatchlist;
