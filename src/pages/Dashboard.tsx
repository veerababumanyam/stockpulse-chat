
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
    toast({
      title: "API Key Required",
      description: "You'll need to set up your API key to access market data.",
      action: <ToastAction altText="Set up API key" onClick={() => navigate('/api-keys')}>
          Set up now
        </ToastAction>
    });
  };

  if (error) {
    const isSuspendedError = error.includes('suspended') || error.includes('invalid');
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{isSuspendedError ? "API Key Error" : "Error"}</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error}</p>
          {isSuspendedError && (
            <>
              <p className="font-medium">What to do:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Visit <a href="https://financialmodelingprep.com/developer" className="underline" target="_blank" rel="noopener noreferrer">financialmodelingprep.com</a> to check your API key status</li>
                <li>If needed, generate a new API key</li>
                <li>Update your API key in the settings</li>
              </ol>
              <div className="pt-2">
                <button 
                  onClick={() => navigate('/api-keys')} 
                  className="text-destructive px-4 py-2 rounded transition-colors text-slate-50 bg-red-600 hover:bg-red-500"
                >
                  Update API Key
                </button>
              </div>
            </>
          )}
        </AlertDescription>
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
              <DashboardGrid gainers={topGainers} losers={topLosers} isLoading={isLoading} />
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
