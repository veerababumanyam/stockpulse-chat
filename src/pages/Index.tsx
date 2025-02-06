
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-[100px]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            StockPulse
          </h1>
          <p className="text-xl text-muted-foreground">
            Your intelligent stock market companion. Get real-time insights and AI-powered analysis to make informed investment decisions.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate('/dashboard')}
          >
            Launch Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
