
import { Home, Sun, Moon, UserCog, LayoutDashboard, Key, Briefcase, Star, Filter, Cpu, Search, MessageSquare, Menu, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { SearchBar } from "@/components/SearchBar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const navigationItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/" },
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Portfolio", path: "/portfolio" },
    { icon: <Star className="w-5 h-5" />, label: "Watchlist", path: "/watchlist" },
    { icon: <Filter className="w-5 h-5" />, label: "Screener", path: "/screener" },
    { icon: <Cpu className="w-5 h-5" />, label: "Agents", path: "/agents" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Chat", onClick: handleChat },
  ];

  if (!mounted) {
    return null;
  }

  const renderNavigationContent = () => (
    <>
      {navigationItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          aria-label={item.label}
          onClick={item.onClick || (() => navigate(item.path))}
        >
          {item.icon}
          {!isMobile && <span className="font-medium">{item.label}</span>}
        </Button>
      ))}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full p-4 glass-panel z-50" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {isMobile ? (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-4">
                  {renderNavigationContent()}
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex-1 flex justify-center mx-4">
              <SearchBar />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              {renderNavigationContent()}
            </div>
            <div className="flex-1 flex justify-center mx-4">
              <SearchBar />
            </div>
          </>
        )}
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
              >
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                aria-label="Open profile settings"
                size="icon"
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

