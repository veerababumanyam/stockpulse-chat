
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  Sun, 
  Moon, 
  BrainCircuit, 
  TrendingUp, 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Database,
  ChartBar,
  Scale,
  Search,
  Lock
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full dark:bg-gradient-to-br dark:from-background dark:via-background dark:to-background/20 bg-gradient-to-br from-background via-background to-background/20 -z-10" />
        <div className="absolute inset-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10" />
        
        <div className="container px-4 pt-[100px] relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="relative inline-block">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary animate-fadeIn">
                Powered by Advanced AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent animate-fadeIn">
              The Future of Stock Market Analysis
            </h1>
            
            <p className="text-xl text-muted-foreground animate-fadeIn delay-100 max-w-2xl mx-auto">
              Make data-driven investment decisions with AI-powered insights, real-time analysis, and predictive algorithms.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn delay-200">
              <Button 
                size="lg" 
                className="text-lg px-8 group"
                onClick={() => navigate('/dashboard')}
              >
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8"
              >
                Watch Demo
              </Button>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-8 text-center text-muted-foreground animate-fadeIn delay-300">
              <div>
                <h4 className="text-2xl font-bold text-foreground">98%</h4>
                <p>Prediction Accuracy</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-foreground">24/7</h4>
                <p>Market Monitoring</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-foreground">10k+</h4>
                <p>Active Traders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Analysis Suite</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive market analysis powered by specialized AI agents
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl glass-panel space-y-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Fundamental Analysis</h3>
              <p className="text-muted-foreground">
                Deep analysis of financial statements, cash flows, and company fundamentals using advanced AI models
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl glass-panel space-y-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <ChartBar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Technical Analysis</h3>
              <p className="text-muted-foreground">
                Advanced pattern recognition, trend analysis, and technical indicators powered by machine learning
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl glass-panel space-y-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Market Research</h3>
              <p className="text-muted-foreground">
                Comprehensive market research combining news analysis, sentiment tracking, and competitive intelligence
              </p>
            </div>

            <div className="group p-6 rounded-2xl glass-panel space-y-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Sophisticated risk analysis covering volatility, market conditions, and geopolitical factors
              </p>
            </div>

            <div className="group p-6 rounded-2xl glass-panel space-y-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Data Integration</h3>
              <p className="text-muted-foreground">
                Seamless integration of multiple data sources including financial statements, market data, and alternative data
              </p>
            </div>

            <div className="group p-6 rounded-2xl glass-panel space-y-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Predictive Analytics</h3>
              <p className="text-muted-foreground">
                Advanced forecasting using machine learning and deep learning models for market trends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by Traders Worldwide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass-panel">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">S</span>
                </div>
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm text-muted-foreground">Investment Analyst</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "StockPulse has transformed how I analyze market data. The AI insights are incredibly accurate."
              </p>
            </div>
            
            <div className="p-6 rounded-2xl glass-panel">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">M</span>
                </div>
                <div>
                  <p className="font-semibold">Michael Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Portfolio Manager</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The real-time analysis and predictive features have given me an edge in the market."
              </p>
            </div>
            
            <div className="p-6 rounded-2xl glass-panel md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">A</span>
                </div>
                <div>
                  <p className="font-semibold">Alex Thompson</p>
                  <p className="text-sm text-muted-foreground">Day Trader</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I've tried many trading platforms, but StockPulse's AI predictions are unmatched."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Trading Smarter?</h2>
            <p className="text-muted-foreground">
              Join thousands of successful traders who trust StockPulse for their market analysis
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate('/dashboard')}
              >
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 gap-2"
              >
                <Lock className="w-4 h-4" />
                View Security Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">StockPulse</h3>
              <p className="text-sm text-muted-foreground">
                Leading the future of AI-powered stock market analysis
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <Button variant="outline" className="gap-2 mb-4">
                <Mail className="w-4 h-4" />
                Contact Support
              </Button>
              <p className="text-sm text-muted-foreground">
                Available 24/7 for assistance
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 StockPulse. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
