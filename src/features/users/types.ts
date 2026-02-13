
export type UserStatus = "SUSPENDED" | "ACTIVE" | "BLOCKED" | "PENDING_APPROVAL" | "DEACTIVATED"
export interface CreateUserPayload {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: string;
}
export interface UserItem {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  lastLogin: string;
  emailVerified: boolean;
  manufacturerId: string;
  status: UserStatus;
  profile: {
    id: string;
    userId: string;
    address: string;
    city: string;
    state: string;
    country: string | null;
  }
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}


export interface UserStatsItem {
  totalUsers: number;
  activeUsers: number;
  deactivatedUsers: number;
  adminUsers: number;
  totalManufacturers: number;
  archived: number;
  usersByRole: {
    role: string;
    count: number;
  }[]
  recentRegistrations: number;
}
