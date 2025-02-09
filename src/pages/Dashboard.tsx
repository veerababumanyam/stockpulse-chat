
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
  const { hasApiKey, topGainers, topLosers, isLoading, error } = useDashboardData();

  const handleSetupApiKey = () => {
    toast({
      title: "API Key Required",
      description: "You'll need to set up your API key to access market data.",
      action: (
        <ToastAction altText="Set up API key" onClick={() => navigate('/api-keys')}>
          Set up now
        </ToastAction>
      ),
    });
  };

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      <div className="pt-[72px]">
        <main className="px-4 py-6 md:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            <DashboardHeader handleSetupApiKey={handleSetupApiKey} />
            
            {!hasApiKey ? (
              <NoApiKeyPanel onSetupClick={handleSetupApiKey} />
            ) : (
              <DashboardGrid 
                gainers={topGainers}
                losers={topLosers}
                isLoading={isLoading}
              />
            )}
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

