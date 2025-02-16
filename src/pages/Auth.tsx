
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // First try to sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email: 'admin@sp.com',
        password: 'admin123',
      });

      if (signUpError) {
        // If signup fails because user exists, try to sign in
        if (signUpError.message.includes('User already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: 'admin@sp.com',
            password: 'admin123',
          });
          
          if (signInError) throw signInError;
        } else {
          throw signUpError;
        }
      }

      navigate('/api-keys');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleDemoLogin} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? 'Setting up...' : 'Use Demo Account'}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Using demo credentials:<br />
              Email: admin@sp.com<br />
              Password: admin123
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
