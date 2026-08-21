import { Request, Response, NextFunction } from 'express';
import { driverService } from '../services/driverService';
import { sendSuccess } from '../utils/response';

export const driverController = {
  getDuty(_req: Request, res: Response, next: NextFunction): void {
    try {
      sendSuccess(res, driverService.getDutyInfo());
    } catch (err) {
      next(err);
    }
  },

  submitChecklist(req: Request, res: Response, next: NextFunction): void {
    try {
      const updated = driverService.submitChecklist(req.body.items || []);
      sendSuccess(res, updated, 'Inspection checklist updated');
    } catch (err) {
      next(err);
    }
  },

  updateTelemetry(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = driverService.updateTelemetry(Number(req.body.speedKmh));
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  triggerSos(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = driverService.triggerSos(req.body.message);
      sendSuccess(res, result, 'SOS alert broadcast');
    } catch (err) {
      next(err);
    }
  },
};
