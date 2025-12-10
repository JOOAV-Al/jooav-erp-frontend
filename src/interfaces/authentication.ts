export interface User {
  id: string;
  email: string;
  address: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage: string | null;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
};


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isUserLoading: boolean;
}