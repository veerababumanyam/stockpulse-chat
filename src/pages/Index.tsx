
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon, LineChart, TrendingUp, ShieldCheck, Mail } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Landing-specific navigation */}
      <nav className="fixed top-0 left-0 w-full p-4 z-50 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              StockPulse
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="container mx-auto px-4 pt-[100px]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fadeIn">
            Make Smarter Investment Decisions
          </h1>
          <p className="text-xl text-muted-foreground animate-fadeIn delay-100">
            Your intelligent stock market companion. Get real-time insights and AI-powered analysis to make informed investment decisions.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 animate-fadeIn delay-200"
            onClick={() => navigate('/dashboard')}
          >
            Start Analyzing Now
          </Button>
        </div>
      </section>

      {/* Features section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg glass-panel space-y-4 animate-fadeIn delay-300">
            <LineChart className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-semibold">Real-time Analysis</h3>
            <p className="text-muted-foreground">
              Get instant insights on market trends and stock performance
            </p>
          </div>
          <div className="p-6 rounded-lg glass-panel space-y-4 animate-fadeIn delay-400">
            <TrendingUp className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-semibold">AI-Powered Predictions</h3>
            <p className="text-muted-foreground">
              Advanced algorithms predict market movements with high accuracy
            </p>
          </div>
          <div className="p-6 rounded-lg glass-panel space-y-4 animate-fadeIn delay-500">
            <ShieldCheck className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your data is protected with enterprise-grade security
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg glass-panel">
            <p className="text-muted-foreground italic mb-4">
              "StockPulse has transformed how I analyze market data. The AI insights are incredibly accurate and have helped me make better investment decisions."
            </p>
            <p className="font-semibold">Sarah Chen</p>
            <p className="text-sm text-muted-foreground">Investment Analyst</p>
          </div>
          <div className="p-6 rounded-lg glass-panel">
            <p className="text-muted-foreground italic mb-4">
              "The real-time analysis and predictive features have given me an edge in the market. Highly recommended for serious investors."
            </p>
            <p className="font-semibold">Michael Rodriguez</p>
            <p className="text-sm text-muted-foreground">Portfolio Manager</p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Need Help?</h2>
          <p className="text-muted-foreground">Our support team is here to assist you</p>
          <Button variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Contact Support
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 StockPulse. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
