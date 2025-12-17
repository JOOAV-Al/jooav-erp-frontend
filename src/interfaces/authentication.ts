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
