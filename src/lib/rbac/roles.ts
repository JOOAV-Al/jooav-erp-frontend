export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUB_ADMIN: 'SUB_ADMIN',
  // SME_USER: 'SME_USER', //For users repo/app.
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
