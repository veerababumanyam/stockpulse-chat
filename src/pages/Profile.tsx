
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Bell, Shield, Palette } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { NotificationsForm } from "@/components/profile/NotificationsForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { AppearanceForm } from "@/components/profile/AppearanceForm";

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105"
    },
    socialLinks: {
      github: "github.com/johndoe",
      twitter: "twitter.com/johndoe",
      linkedin: "linkedin.com/in/johndoe"
    },
    avatar: "/placeholder.svg",
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

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
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
              <CardContent>
                <ProfileForm
                  profile={profile}
                  setProfile={setProfile}
                  handleSaveProfile={handleSaveProfile}
                  handleAvatarUpload={handleAvatarUpload}
                />
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
              <CardContent>
                <NotificationsForm
                  profile={profile}
                  setProfile={setProfile}
                  handleUpdateNotifications={handleUpdateNotifications}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SecurityForm />
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
              <CardContent>
                <AppearanceForm
                  profile={profile}
                  setProfile={setProfile}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
