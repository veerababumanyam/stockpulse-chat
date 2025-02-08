
import { Home, LayoutDashboard, Briefcase, Star, Filter, Cpu, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface NavigationItemsProps {
  isMobile: boolean;
}

export const NavigationItems = ({ isMobile }: NavigationItemsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
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
};
