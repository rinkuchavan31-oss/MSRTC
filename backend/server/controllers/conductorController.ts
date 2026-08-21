import { Request, Response, NextFunction } from 'express';
import { conductorService } from '../services/conductorService';
import { sendSuccess, sendCreated } from '../utils/response';

export const conductorController = {
  validateQr(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = conductorService.validateQr(req.body.qrPayload);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  getManifest(req: Request, res: Response, next: NextFunction): void {
    try {
      const manifest = conductorService.getManifest(req.params.tripId);
      sendSuccess(res, manifest);
    } catch (err) {
      next(err);
    }
  },

  toggleBoarding(req: Request, res: Response, next: NextFunction): void {
    try {
      const { tripId, seatNumber } = req.body;
      const item = conductorService.toggleBoarding(tripId, seatNumber);
      sendSuccess(res, item, `Boarding status updated for seat ${seatNumber}`);
    } catch (err) {
      next(err);
    }
  },

  issueSpotTicket(req: Request, res: Response, next: NextFunction): void {
    try {
      const item = conductorService.issueSpotTicket(req.body);
      sendCreated(res, item, 'Spot cash ticket issued successfully');
    } catch (err) {
      next(err);
    }
  },
};
