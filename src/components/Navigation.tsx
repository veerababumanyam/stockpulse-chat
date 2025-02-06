
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
    <nav className="fixed top-0 left-0 w-full md:w-3/4 p-4 glass-panel z-50">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-foreground hover:bg-accent"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="hover:bg-accent"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" aria-hidden="true" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" aria-hidden="true" />
          )}
        </Button>
      </div>
    </nav>
  );
};
