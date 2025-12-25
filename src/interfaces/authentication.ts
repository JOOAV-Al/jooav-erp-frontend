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
  assignedRegions: [];
  permissions: {
    canManageManufacturers: boolean,
    canApproveSMEs: boolean,
    canManageSubAdmins: boolean,
    canAccessAnalytics: boolean,
    canModifySystemConfig: boolean
  },
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};
