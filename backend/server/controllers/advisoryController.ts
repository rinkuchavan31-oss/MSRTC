import { Request, Response, NextFunction } from 'express';
import { advisoryService } from '../services/advisoryService';
import { sendSuccess } from '../utils/response';

export const advisoryController = {
  getMonsoon(_req: Request, res: Response, next: NextFunction): void {
    try {
      sendSuccess(res, advisoryService.getMonsoonAdvisories());
    } catch (err) {
      next(err);
    }
  },

  getNotifications(_req: Request, res: Response, next: NextFunction): void {
    try {
      sendSuccess(res, advisoryService.getNotifications());
    } catch (err) {
      next(err);
    }
  },

  markRead(req: Request, res: Response, next: NextFunction): void {
    try {
      advisoryService.markNotificationRead(req.params.id);
      sendSuccess(res, null, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  },
};
