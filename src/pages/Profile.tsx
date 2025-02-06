
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              This is the profile settings page. Your profile settings will appear here.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
