
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NoApiKeyPanel } from "@/components/dashboard/NoApiKeyPanel";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const DashboardContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    hasApiKey,
    topGainers,
    topLosers,
    isLoading,
    error
  } = useDashboardData();

  const handleSetupApiKey = () => {
    navigate('/api-keys');
  };

  // Show loading state while checking API key
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Navigation />
        <div className="pt-[72px]">
          <main className="px-4 py-6 md:p-8 lg:p-10">
            <div className="max-w-[1600px] mx-auto space-y-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If no API key or error, show setup panel or error message
  if (!hasApiKey || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Navigation />
        <div className="pt-[72px]">
          <main className="px-4 py-6 md:p-8 lg:p-10">
            <div className="max-w-[1600px] mx-auto space-y-8">
              {error ? (
                <Alert variant="destructive" className="my-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>API Key Error</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>{error}</p>
                    <div className="space-y-4">
                      <p className="font-medium">To fix this:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Visit <a href="https://site.financialmodelingprep.com/developer" className="underline" target="_blank" rel="noopener noreferrer">financialmodelingprep.com</a> to get a valid API key</li>
                        <li>Copy your new API key</li>
                        <li>Click the button below to add it to your settings</li>
                      </ol>
                      <button 
                        onClick={handleSetupApiKey}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Set up API Key
                      </button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <NoApiKeyPanel onSetupClick={handleSetupApiKey} />
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Only show dashboard content if we have a valid API key
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      <div className="pt-[72px]">
        <main className="px-4 py-6 md:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            <DashboardHeader handleSetupApiKey={handleSetupApiKey} />
            <DashboardGrid gainers={topGainers} losers={topLosers} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
};

export default Dashboard;
