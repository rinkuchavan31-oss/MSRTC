export const CONCESSION_TYPES = {
  NONE: 'none',
  WOMEN: 'women', // Mahila Samman 50%
  SENIOR: 'senior', // Senior Citizen 50% / 75+ free
  STUDENT: 'student', // Student 30%
} as const;

export type ConcessionType = typeof CONCESSION_TYPES[keyof typeof CONCESSION_TYPES];

export const CONCESSION_DISCOUNT_RATES: Record<ConcessionType, number> = {
  none: 0,
  women: 0.50, // 50% Mahila Samman
  senior: 0.50, // 50% Senior Citizen
  student: 0.30, // 30% Student
};
