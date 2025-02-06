
import { UserProfile } from "@/types/profile";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AppearanceFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export const AppearanceForm = ({ profile, setProfile }: AppearanceFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Compact Mode</Label>
          <div className="text-sm text-muted-foreground">
            Use a more compact display for the interface
          </div>
        </div>
        <Switch
          checked={profile.appearance.compact}
          onCheckedChange={(checked) =>
            setProfile({
              ...profile,
              appearance: { ...profile.appearance, compact: checked },
            })
          }
        />
      </div>
      <Button>Save Display Settings</Button>
    </div>
  );
};
