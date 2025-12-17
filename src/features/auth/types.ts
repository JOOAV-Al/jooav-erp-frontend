import { User } from "@/interfaces/authentication";

// src/features/auth/types.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isUserLoading: boolean;
}
