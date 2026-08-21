import { Response, NextFunction } from 'express';
import { AppError } from '../utils/response';
import { UserRole, CLEARANCE_LEVELS } from '../constants/roles';
import { AuthenticatedRequest } from './authMiddleware';

/**
 * Requires at least one of the specified roles.
 * Must be used after authenticate() middleware.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication is required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'PERMISSION_DENIED',
          `This action requires one of the following roles: ${allowedRoles.join(', ')}.`,
        ),
      );
    }

    next();
  };
}

/**
 * Requires a minimum clearance level.
 * Must be used after authenticate() middleware.
 */
export function requireClearanceLevel(minimumLevel: number) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication is required.'));
    }

    const userLevel = CLEARANCE_LEVELS[req.user.role] ?? 0;
    if (userLevel < minimumLevel) {
      return next(
        new AppError(
          403,
          'PERMISSION_DENIED',
          `Insufficient clearance level. Required: ${minimumLevel}, your level: ${userLevel}.`,
        ),
      );
    }

    next();
  };
}
