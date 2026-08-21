export const BUS_SERVICE_TYPES = {
  SHIVNERI: 'SHIVNERI',
  SHIVSHAHI: 'SHIVSHAHI',
  PARIVARTAN: 'PARIVARTAN',
  ASIAD: 'ASIAD',
  LAL_PARI: 'LAL_PARI',
  E_SHIVNERI: 'E_SHIVNERI',
} as const;

export type BusServiceType = typeof BUS_SERVICE_TYPES[keyof typeof BUS_SERVICE_TYPES];

export const AC_SERVICE_TYPES: BusServiceType[] = [
  'SHIVNERI',
  'SHIVSHAHI',
  'E_SHIVNERI',
];
