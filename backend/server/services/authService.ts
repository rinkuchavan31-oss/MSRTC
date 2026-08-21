import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../utils/response';
import { User } from '../models/types';
import { UserRole } from '../constants/roles';

export interface LoginPayload {
  employeeId: string;
  password?: string;
  role: UserRole;
  authType?: 'password' | 'otp';
  otpCode?: string;
}

export interface LoginResult {
  token: string;
  user: Pick<User, 'id' | 'employeeId' | 'name' | 'role' | 'depot'>;
}

function signToken(user: User): string {
  return jwt.sign(
    { id: user.id, employeeId: user.employeeId, role: user.role, depot: user.depot, name: user.name },
    ENV.JWT_SECRET,
    { expiresIn: '24h' },
  );
}

export const authService = {
  login(payload: LoginPayload): LoginResult {
    const { employeeId, password, authType = 'password', otpCode } = payload;

    if (!employeeId?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Employee ID is required.');
    }

    if (authType === 'password' && !password?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Password is required.');
    }

    if (authType === 'otp' && !otpCode?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'OTP code is required.');
    }

    const user = userRepository.findByEmployeeId(employeeId.trim());

    // OTP path: accept any 6-digit code (simulation; real OTP validation would be via SMS provider)
    if (authType === 'otp') {
      if (!otpCode || !/^\d{6}$/.test(otpCode)) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid OTP code. Please request a new one.');
      }
      // For demo: any valid-format OTP succeeds for known staff
      if (!user || user.status !== 'ACTIVE') {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Employee not found or account is not active.');
      }
    } else {
      if (!user || !userRepository.verifyPassword(user, password!)) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid Employee ID or password.');
      }
      if (user.status !== 'ACTIVE') {
        throw new AppError(403, 'ACCOUNT_SUSPENDED', 'Account is suspended. Contact your depot controller.');
      }
    }

    const token = signToken(user);
    return {
      token,
      user: { id: user.id, employeeId: user.employeeId, name: user.name, role: user.role, depot: user.depot },
    };
  },

  registerRequest(payload: {
    employeeId: string;
    fullName: string;
    role: UserRole;
    depot: string;
    mobileNumber: string;
  }): { requestId: string; status: string } {
    const { employeeId, fullName, mobileNumber } = payload;

    if (!employeeId?.trim() || !fullName?.trim() || !mobileNumber?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Employee ID, full name, and mobile number are required.');
    }

    const mobile = mobileNumber.replace(/\D/g, '');
    if (mobile.length < 10) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Please enter a valid 10-digit mobile number.');
    }

    const existing = userRepository.findByEmployeeId(employeeId.trim());
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'An account with this Employee ID already exists.');
    }

    const requestId = `REQ-MSRTC-${Math.floor(100000 + Math.random() * 900000)}`;
    return { requestId, status: 'PENDING_VERIFICATION' };
  },

  conductorDutyStart(payload: {
    badgeId: string;
    busNumber: string;
    origin: string;
    destination: string;
  }): { dutyId: string; status: string } {
    const { badgeId, busNumber, origin, destination } = payload;

    if (!badgeId?.trim() || !busNumber?.trim() || !origin?.trim() || !destination?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Badge ID, bus number, origin, and destination are required.');
    }

    const dutyId = `DUTY-${badgeId}-${new Date().toISOString().split('T')[0]}`;
    return { dutyId, status: 'ACTIVE' };
  },
};
