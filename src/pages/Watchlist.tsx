
import { Navigation } from "@/components/Navigation";
import { WatchlistTable } from "@/components/watchlist/WatchlistTable";
import { WatchlistHeader } from "@/components/watchlist/WatchlistHeader";
import { AlertsDialog } from "@/components/watchlist/AlertsDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useTheme } from "next-themes";

const Watchlist = () => {
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const { stocks, isLoading, error, exportData } = useWatchlist();
  const { theme } = useTheme();

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-20 p-4">
          <div className="text-center text-destructive">
            {error.message}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <div className="flex flex-col gap-6">
          <WatchlistHeader onExport={exportData} onOpenAlerts={() => setShowAlertsDialog(true)} />
          
          <div className="rounded-lg border bg-card">
            <WatchlistTable 
              stocks={stocks} 
              isLoading={isLoading} 
              theme={theme as 'light' | 'dark'} 
            />
          </div>

          <AlertsDialog 
            open={showAlertsDialog} 
            onOpenChange={setShowAlertsDialog} 
          />
        </div>
      </main>
    </div>
  );
};

export default Watchlist;

