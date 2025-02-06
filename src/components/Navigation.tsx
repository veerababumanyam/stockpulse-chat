
import { Home, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export const Navigation = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 w-3/4 p-4 glass-panel z-50">
      <div className="flex items-center justify-between">
        <button className="nav-button flex items-center gap-2">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
        
        <button
          className="nav-button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </nav>
  );
};
