
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchBar } from "@/components/SearchBar";
import { NavigationItems } from "./navigation/NavigationItems";
import { ThemeToggle } from "./navigation/ThemeToggle";
import { UserMenu } from "./navigation/UserMenu";
import { MobileNavigation } from "./navigation/MobileNavigation";

export const Navigation = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 left-0 w-full p-4 glass-panel z-50 dark:bg-gray-900 transition-colors duration-300" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {isMobile ? (
          <MobileNavigation />
        ) : (
          <>
            <div className="flex items-center gap-4">
              <NavigationItems isMobile={false} />
            </div>
            <div className="flex-1 flex justify-center mx-4">
              <SearchBar />
            </div>
          </>
        )}
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};
