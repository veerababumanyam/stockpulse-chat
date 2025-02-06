
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const SecurityForm = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Current Password</Label>
        <Input type="password" className="max-w-md" />
      </div>
      <div className="space-y-2">
        <Label>New Password</Label>
        <Input type="password" className="max-w-md" />
      </div>
      <div className="space-y-2">
        <Label>Confirm New Password</Label>
        <Input type="password" className="max-w-md" />
      </div>
      <Button>Update Password</Button>
    </div>
  );
};
