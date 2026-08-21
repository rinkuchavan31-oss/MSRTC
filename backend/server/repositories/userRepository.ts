import { User } from '../models/types';
import { createHash } from 'crypto';

// Simple deterministic hash for seed data (not bcrypt — avoids dependency)
const hashPassword = (pw: string) => createHash('sha256').update(pw).digest('hex');

const DEMO_PASSWORD_HASH = hashPassword('msrtc@2026');

const usersStore = new Map<string, User>([
  ['usr-adm-01', {
    id: 'usr-adm-01', employeeId: 'ADM-SWG-9042', name: 'Rajesh Deshmukh (Fleet Controller)',
    role: 'admin', depot: 'Swargate, Pune', mobileNumber: '+919876500001',
    passwordHash: DEMO_PASSWORD_HASH, status: 'ACTIVE', createdAt: '2026-01-01',
  }],
  ['usr-cnd-01', {
    id: 'usr-cnd-01', employeeId: 'CND-DDR-4418', name: 'Sunil Patil (ETIM Badge #4418)',
    role: 'conductor', depot: 'Dadar Central, Mumbai', mobileNumber: '+919876500002',
    passwordHash: DEMO_PASSWORD_HASH, status: 'ACTIVE', createdAt: '2026-01-01',
  }],
  ['usr-drv-01', {
    id: 'usr-drv-01', employeeId: 'DRV-NSK-8821', name: 'Santosh Kadam (Heavy Passenger Vehicle #8821)',
    role: 'driver', depot: 'Nashik CBS', mobileNumber: '+919876500003',
    passwordHash: DEMO_PASSWORD_HASH, status: 'ACTIVE', createdAt: '2026-01-01',
  }],
]);

export const userRepository = {
  findByEmployeeId(employeeId: string): User | undefined {
    for (const user of usersStore.values()) {
      if (user.employeeId === employeeId) return user;
    }
    return undefined;
  },

  findById(id: string): User | undefined {
    return usersStore.get(id);
  },

  verifyPassword(user: User, plainPassword: string): boolean {
    return user.passwordHash === hashPassword(plainPassword);
  },

  save(user: User): User {
    usersStore.set(user.id, user);
    return user;
  },

  hashPassword,
};
