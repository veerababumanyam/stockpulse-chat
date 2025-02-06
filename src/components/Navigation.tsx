
import { Home, Sun, Moon, UserCog, LayoutDashboard, Key, Briefcase, Star, Filter, Cpu, Search, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { SearchBar } from "@/components/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProfileSettings = () => {
    toast({
      title: "Profile Settings",
      description: "Opening profile settings panel",
    });
    navigate("/profile");
  };

  const handleApiKeys = () => {
    toast({
      title: "API Keys",
      description: "Opening API keys management",
    });
    navigate("/api-keys");
  };

  const handleChat = () => {
    try {
      toast({
        title: "Opening Chat",
        description: "Launching chat window",
      });
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open chat window",
        variant: "destructive",
      });
      console.error("Chat navigation error:", error);
    }
  };

  const handlePreferences = () => {
    toast({
      title: "Preferences",
      description: "Opening preferences panel",
    });
    navigate("/preferences");
  };

  const handleSecurity = () => {
    toast({
      title: "Security Settings",
      description: "Opening security settings panel",
    });
    navigate("/security");
  };

  const handleSignOut = () => {
    toast({
      title: "Signing out",
      description: "You have been signed out successfully",
    });
    navigate("/");
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full p-4 glass-panel z-50" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Go to home page"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Home</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Go to dashboard"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Dashboard</span>
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Go to portfolio"
            onClick={() => navigate("/portfolio")}
          >
            <Briefcase className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Portfolio</span>
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Go to watchlist"
            onClick={() => navigate("/watchlist")}
          >
            <Star className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Watchlist</span>
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Go to screener"
            onClick={() => navigate("/screener")}
          >
            <Filter className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Screener</span>
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Go to agents"
            onClick={() => navigate("/agents")}
          >
            <Cpu className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Agents</span>
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Open chat"
            onClick={handleChat}
          >
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Chat</span>
          </Button>
        </div>

        <div className="flex-1 flex justify-center mx-4">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-200 hover:rotate-12" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 transition-transform duration-200 hover:-rotate-12" aria-hidden="true" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                aria-label="Open profile settings"
              >
                <UserCog className="w-5 h-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/api-keys")}
              >
                API Keys
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-destructive cursor-pointer"
                onClick={() => {
                  toast({
                    title: "Signing out",
                    description: "You have been signed out successfully",
                  });
                  navigate("/");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
