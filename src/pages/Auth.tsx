
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setupDemoUser();
  }, []);

  const setupDemoUser = async () => {
    try {
      // First try to sign up the demo user
      const { error: signUpError } = await supabase.auth.signUp({
        email: 'demo@example.com',
        password: 'demo-password',
      });

      // If sign up fails (likely because user exists), proceed to login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo-password',
      });

      if (signInError) throw signInError;

      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to set up demo user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting up demo account...</h1>
        <p className="text-muted-foreground">This may take a few moments...</p>
      </div>
    </div>
  );
};

export default Auth;
