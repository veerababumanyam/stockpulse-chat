
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import ApiKeys from "@/pages/ApiKeys";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/api-keys"
          element={isAuthenticated ? <ApiKeys /> : <Navigate to="/auth" />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
