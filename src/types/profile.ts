
export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  socialLinks: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  avatar: string;
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
