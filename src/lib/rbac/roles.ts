export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  // SUB_ADMIN: 'SUB_ADMIN',
  PROCUREMENT_OFFICER: 'PROCUREMENT_OFFICER',
  WHOLESALER: 'WHOLESALER', //For users repo/app.
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const userRoles = [
  {value: ROLES.ADMIN, label: "Admin"},
  {value: ROLES.PROCUREMENT_OFFICER, label: "Procurement"},
  {value: ROLES.WHOLESALER, label: "Wholesaler"},
  {value: ROLES.SUPER_ADMIN, label: "Superadmin"},
  // {value: ROLES.SUB_ADMIN, label: "Sub Admin"},
]