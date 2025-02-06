
import { Home, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full p-4 glass-panel z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium hidden sm:inline">Home</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-200 hover:rotate-12" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
          )}
        </Button>
      </div>
    </nav>
  );
};
