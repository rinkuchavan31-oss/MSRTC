import { Request, Response, NextFunction } from 'express';
import { tripService } from '../services/tripService';
import { sendSuccess } from '../utils/response';
import { BusServiceType } from '../constants/busTypes';

export const tripController = {
  search(req: Request, res: Response, next: NextFunction): void {
    try {
      const { from, to, date, serviceTypes, windows, sortBy, maxPrice } = req.query;
      const result = tripService.search({
        from: from as string | undefined,
        to: to as string | undefined,
        date: date as string | undefined,
        serviceTypes: serviceTypes ? String(serviceTypes).split(',') as BusServiceType[] : undefined,
        windows: windows ? String(windows).split(',') : undefined,
        sortBy: sortBy as 'earliest' | 'cheapest' | 'fastest' | undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string, 10) : undefined,
      });
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const trip = tripService.getById(req.params.id);
      sendSuccess(res, trip);
    } catch (err) {
      next(err);
    }
  },

  getSeats(req: Request, res: Response, next: NextFunction): void {
    try {
      const data = tripService.getSeats(req.params.id);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  getPopularLocations(_req: Request, res: Response, next: NextFunction): void {
    try {
      const locations = tripService.getPopularLocations();
      sendSuccess(res, locations);
    } catch (err) {
      next(err);
    }
  },
};
