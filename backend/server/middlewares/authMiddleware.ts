import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AppError } from '../utils/response';
import { UserRole } from '../constants/roles';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    employeeId: string;
    role: UserRole;
    depot: string;
    name: string;
  };
}

/**
 * Verifies the JWT Bearer token and hydrates req.user.
 * Endpoints that call this are considered protected.
 */
export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'AUTH_REQUIRED', 'Authorization token is required.'));
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedRequest['user'];
    req.user = decoded;
    next();
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'Token is invalid or has expired.'));
  }
}

/**
 * Optional auth — hydrates req.user if token is present, but does not block the request.
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(
        authHeader.slice(7),
        ENV.JWT_SECRET,
      ) as AuthenticatedRequest['user'];
      req.user = decoded;
    } catch {
      // Ignore — optional auth does not block unauthenticated requests
    }
  }
  next();
}
