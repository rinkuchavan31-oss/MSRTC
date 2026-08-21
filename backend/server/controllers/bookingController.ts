import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService';
import { sendSuccess, sendCreated } from '../utils/response';

export const bookingController = {
  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const booking = bookingService.create(req.body);
      sendCreated(res, booking, 'Ticket confirmed successfully');
    } catch (err) {
      next(err);
    }
  },

  getAll(_req: Request, res: Response, next: NextFunction): void {
    try {
      const bookings = bookingService.findAll();
      sendSuccess(res, bookings);
    } catch (err) {
      next(err);
    }
  },

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const booking = bookingService.findById(req.params.id);
      sendSuccess(res, booking);
    } catch (err) {
      next(err);
    }
  },

  cancel(req: Request, res: Response, next: NextFunction): void {
    try {
      const booking = bookingService.cancel(req.params.id);
      sendSuccess(res, booking, 'Booking cancelled successfully');
    } catch (err) {
      next(err);
    }
  },
};
