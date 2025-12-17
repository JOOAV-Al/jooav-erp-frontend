import { Role } from "@/lib/rbac/roles";

export interface User {
  id: string;
  email: string;
  address: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage: string | null;
  role: Role;
};
