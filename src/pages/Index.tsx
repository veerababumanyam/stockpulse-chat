
import { Navigation } from "@/components/Navigation";
import { ChatWindow } from "@/components/ChatWindow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="w-3/4 p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 animate-fadeIn">
            <h1 className="text-4xl font-bold">Welcome to StockPulse</h1>
            <p className="text-lg text-muted-foreground">
              Your AI-powered stock market analysis assistant. Ask questions about stocks,
              market trends, and get real-time insights.
            </p>
          </div>
        </div>
      </main>
      <ChatWindow />
    </div>
  );
};

export default Index;
