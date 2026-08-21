import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/response';
import { logger } from '../config/logger';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn(`[${err.code}] ${err.message}`, { path: req.path, method: req.method });
    sendError(res, err.statusCode, err.code, err.message, err.errors);
    return;
  }

  logger.error('Unhandled server error', err);
  sendError(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again.'
      : err.message,
  );
}
