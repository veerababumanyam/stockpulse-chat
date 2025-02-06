
import { UserProfile } from "@/types/profile";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface NotificationsFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  handleUpdateNotifications: () => void;
}

export const NotificationsForm = ({
  profile,
  setProfile,
  handleUpdateNotifications,
}: NotificationsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Email Notifications</Label>
          <div className="text-sm text-muted-foreground">
            Receive email updates about your account
          </div>
        </div>
        <Switch
          checked={profile.notifications.email}
          onCheckedChange={(checked) =>
            setProfile({
              ...profile,
              notifications: { ...profile.notifications, email: checked },
            })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Desktop Notifications</Label>
          <div className="text-sm text-muted-foreground">
            Get desktop notifications for important updates
          </div>
        </div>
        <Switch
          checked={profile.notifications.desktop}
          onCheckedChange={(checked) =>
            setProfile({
              ...profile,
              notifications: { ...profile.notifications, desktop: checked },
            })
          }
        />
      </div>
      <Button onClick={handleUpdateNotifications}>Save Preferences</Button>
    </div>
  );
};
