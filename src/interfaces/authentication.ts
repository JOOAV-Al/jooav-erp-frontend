export type UserRole = "CUSTOMER" | "WHOLESALER";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string | null;
  role: UserRole;
  status: string;
  emailVerified: boolean;
  lastLogin: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: string;
    userId: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    createdAt: string;
    updatedAt: string;
  };
  wholesalerProfile?: {
    id: string;
    userId: string;
    regionId: string | null;
    totalOrders: number;
    totalSpent: string;
    createdAt: string;
    updatedAt: string;
  };
}
