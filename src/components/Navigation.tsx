
import { Home, Sun, Moon, UserCog, LayoutDashboard, Key } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
            aria-label="Manage API Keys"
            onClick={() => navigate("/api-keys")}
          >
            <Key className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">API Keys</span>
          </Button>
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
                onClick={handleProfileSettings}
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={handlePreferences}
              >
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleSecurity}
              >
                Security
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-destructive cursor-pointer"
                onClick={handleSignOut}
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
