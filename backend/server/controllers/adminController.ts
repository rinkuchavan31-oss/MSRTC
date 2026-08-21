import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/adminService';
import { sendSuccess } from '../utils/response';

export const adminController = {
  getStats(_req: Request, res: Response, next: NextFunction): void {
    try {
      const stats = adminService.getStats();
      sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  },

  getTrips(_req: Request, res: Response, next: NextFunction): void {
    try {
      const trips = adminService.getTrips();
      sendSuccess(res, trips);
    } catch (err) {
      next(err);
    }
  },

  updateSurcharge(req: Request, res: Response, next: NextFunction): void {
    try {
      const { surchargePercent } = req.body;
      const stats = adminService.updateSurcharge(Number(surchargePercent));
      sendSuccess(res, stats, 'Dynamic surcharge updated successfully');
    } catch (err) {
      next(err);
    }
  },
};
