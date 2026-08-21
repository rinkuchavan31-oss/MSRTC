import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { sendSuccess, sendCreated } from '../utils/response';

export const authController = {
  login(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = authService.login(req.body);
      sendSuccess(res, result, 'Authenticated successfully');
    } catch (err) {
      next(err);
    }
  },

  registerRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = authService.registerRequest(req.body);
      sendCreated(res, result, 'Staff onboarding request submitted');
    } catch (err) {
      next(err);
    }
  },

  conductorDutyStart(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = authService.conductorDutyStart(req.body);
      sendSuccess(res, result, 'Conductor duty shift started');
    } catch (err) {
      next(err);
    }
  },
};
