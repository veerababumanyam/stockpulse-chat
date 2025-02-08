
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface AlertsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AlertsDialog = ({ open, onOpenChange }: AlertsDialogProps) => {
  const [email, setEmail] = useState(localStorage.getItem('alert-email') || '');
  const [emailEnabled, setEmailEnabled] = useState(localStorage.getItem('alert-email-enabled') === 'true');
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('alert-email', email);
    localStorage.setItem('alert-email-enabled', emailEnabled.toString());
    toast({
      title: "Alert settings saved",
      description: "Your alert preferences have been updated.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alert Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-alerts">Email Alerts</Label>
            <Switch
              id="email-alerts"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>
          {emailEnabled && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
              />
            </div>
          )}
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
