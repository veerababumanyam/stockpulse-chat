
import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  handleSaveProfile: () => void;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileForm = ({
  profile,
  setProfile,
  handleSaveProfile,
  handleAvatarUpload,
}: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={profile.avatar} />
          <AvatarFallback>
            {profile.firstName[0]}{profile.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="avatar" className="block mb-2">Profile Picture</Label>
          <div className="flex items-center gap-2">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="max-w-xs"
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Username</Label>
          <Input
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Address
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Street Address</Label>
            <Input
              value={profile.address.street}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, street: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={profile.address.city}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, city: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              value={profile.address.state}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, state: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>ZIP Code</Label>
            <Input
              value={profile.address.zipCode}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, zipCode: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Social Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </Label>
            <Input
              value={profile.socialLinks.github}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, github: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Twitter
            </Label>
            <Input
              value={profile.socialLinks.twitter}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, twitter: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Label>
            <Input
              value={profile.socialLinks.linkedin}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSaveProfile}>Save Changes</Button>
    </div>
  );
};
