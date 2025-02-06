
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ApiKeys from "./pages/ApiKeys";

const queryClient = new QueryClient();

const App = () => {
  // Check if API keys exist in localStorage
  const apiKeys = localStorage.getItem('apiKeys');
  const hasApiKeys = apiKeys && JSON.parse(apiKeys).openai && JSON.parse(apiKeys).fmp;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={hasApiKeys ? <Dashboard /> : <ApiKeys />} 
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/api-keys" element={<ApiKeys />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
