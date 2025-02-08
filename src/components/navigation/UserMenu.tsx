
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
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
  );
};
