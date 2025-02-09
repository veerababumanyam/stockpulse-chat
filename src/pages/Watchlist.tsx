
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { WatchlistTable } from "@/components/watchlist/WatchlistTable";
import { WatchlistHeader } from "@/components/watchlist/WatchlistHeader";
import { AlertsDialog } from "@/components/watchlist/AlertsDialog";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useTheme } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WatchlistContent = () => {
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const { stocks = [], isLoading, error, exportData } = useWatchlist();
  const { theme } = useTheme();

  if (error) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
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
  );
};

const Watchlist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <ErrorBoundary>
          <WatchlistContent />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default Watchlist;

