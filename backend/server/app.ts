import express, { Express } from 'express';
import apiRouter from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './config/logger';
import { ENV } from './config/env';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
    next();
  });

  // CORS — allow same-origin + Vite dev
  const ALLOWED_ORIGINS = [ENV.APP_URL, 'http://localhost:5173', 'http://localhost:3000'];
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Standard middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger middleware
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });

  // Mount API v1 Routes
  app.use('/api/v1', apiRouter);

  // Backward compatibility alias for legacy AI Studio endpoint
  app.post('/api/gemini/assistant', async (req, res, next) => {
    try {
      const { query, language } = req.body;
      const { assistantService } = await import('./services/assistantService');
      const result = await assistantService.chat(query || '', language || 'en');
      res.json({ reply: result.reply, action: result.action });
    } catch (err) {
      next(err);
    }
  });

  // Legacy health check alias
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Central error handling middleware (must be registered last)
  app.use(errorHandler);

  return app;
}
