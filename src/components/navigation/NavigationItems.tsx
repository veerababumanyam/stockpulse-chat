
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart2, Briefcase, Eye, Filter, Search, MessageSquare, LayoutDashboard, Wrench, LineChart } from "lucide-react";

interface NavigationItemsProps {
  isMobile: boolean;
}

export const NavigationItems = ({ isMobile }: NavigationItemsProps) => {
  const location = useLocation();
  
  const items = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
    },
    {
      name: "Watchlist",
      path: "/watchlist",
      icon: <Eye className="w-4 h-4 mr-2" />,
    },
    {
      name: "Portfolio",
      path: "/portfolio",
      icon: <Briefcase className="w-4 h-4 mr-2" />,
    },
    {
      name: "Paper Trading",
      path: "/paper-trading",
      icon: <LineChart className="w-4 h-4 mr-2" />,
    },
    {
      name: "Screener",
      path: "/screener",
      icon: <Filter className="w-4 h-4 mr-2" />,
    },
    {
      name: "Agents",
      path: "/agents",
      icon: <Wrench className="w-4 h-4 mr-2" />,
    },
    {
      name: "Chart",
      path: "/chart",
      icon: <BarChart2 className="w-4 h-4 mr-2" />,
    },
    {
      name: "Chat",
      path: "/chat",
      icon: <MessageSquare className="w-4 h-4 mr-2" />,
    },
  ];

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-md hover:bg-accent",
              location.pathname === item.path ? "bg-accent" : ""
            )}
          >
            <div className="flex items-center justify-center h-6 w-6">
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <>
      <Link to="/" className="text-xl font-bold mr-8">
        StockAI
      </Link>
      <nav className="flex space-x-1">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium flex items-center",
              location.pathname === item.path
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </>
  );
};
