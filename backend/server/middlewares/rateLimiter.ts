import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

const requestCounts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute window

/**
 * Simple sliding-window rate limiter (no external dependency).
 * @param maxRequests - maximum allowed requests per window per IP
 */
export function rateLimiter(maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip ?? 'unknown'}:${req.path}`;
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now > record.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((record.resetAt - now) / 1000));
      sendError(res, 429, 'RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.');
      return;
    }

    next();
  };
}
