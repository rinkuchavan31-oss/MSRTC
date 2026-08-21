export const ROLES = {
  PASSENGER: 'passenger',
  CONDUCTOR: 'conductor',
  ADMIN: 'admin',
  DRIVER: 'driver',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const CLEARANCE_LEVELS: Record<UserRole, number> = {
  passenger: 0,
  driver: 1,
  conductor: 2,
  admin: 4,
};
