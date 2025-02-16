
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupDemoUser();
  }, []);

  const setupDemoUser = async () => {
    try {
      setIsLoading(true);
      
      // First try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo-password',
      });

      // If login fails, try to sign up
      if (signInError) {
        console.log('Sign in failed, attempting signup...', signInError);
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'demo@example.com',
          password: 'demo-password',
        });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          throw signUpError;
        }

        // After successful signup, try signing in again
        const { error: finalSignInError } = await supabase.auth.signInWithPassword({
          email: 'demo@example.com',
          password: 'demo-password',
        });

        if (finalSignInError) throw finalSignInError;
      }

      navigate('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to set up demo user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Setting up demo account...</h1>
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-muted-foreground">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
