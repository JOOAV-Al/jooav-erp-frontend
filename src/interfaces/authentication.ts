import { Role } from "@/lib/rbac/roles";

export interface User {
  id: string;
  email: string;
  address: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  emailVerified: boolean;
  status: string;
  avatar: string | null;
  role: Role;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};
