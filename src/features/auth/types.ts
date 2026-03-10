import { User } from "@/interfaces/authentication";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isUserLoading: boolean;
}
