
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  UserCircle, 
  Bell, 
  Shield, 
  Palette,
  Mail,
  User,
  Lock,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UserProfile {
  name: string;
  email: string;
  notifications: {
    email: boolean;
    desktop: boolean;
    updates: boolean;
  };
  appearance: {
    theme: string;
    compact: boolean;
  };
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    notifications: {
      email: true,
      desktop: true,
      updates: false,
    },
    appearance: {
      theme: "system",
      compact: false,
    },
  });
  
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully",
    });
  };

  const handleUpdateNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Display
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-6 h-6" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="max-w-md"
                  />
                </div>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-6 h-6" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-6 h-6" />
                  Display Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

