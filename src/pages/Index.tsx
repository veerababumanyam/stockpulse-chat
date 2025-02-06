
import { Navigation } from "@/components/Navigation";
import { ChatWindow } from "@/components/ChatWindow";
import { TrendingUp, DollarSign, LineChart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="w-3/4 p-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 animate-fadeIn">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to StockPulse
            </h1>
            <p className="text-xl text-muted-foreground">
              Your AI-powered stock market analysis assistant. Ask questions about stocks,
              market trends, and get real-time insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl animate-float">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
              <p className="text-muted-foreground">
                Get real-time insights into market trends and patterns
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl animate-float">
              <DollarSign className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stock Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your favorite stocks and get instant updates
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl animate-float">
              <LineChart className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Predictions</h3>
              <p className="text-muted-foreground">
                AI-powered predictions based on historical data
              </p>
            </div>
          </div>
        </div>
      </main>
      <ChatWindow />
    </div>
  );
};

export default Index;
