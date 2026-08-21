import { createApp } from './server/app';
import { ENV } from './server/config/env';
import { logger } from './server/config/logger';

async function startServer() {
  const app = createApp();
  const PORT = ENV.PORT;

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`MSRTC NextGen API Server running on http://localhost:${PORT}`);
    logger.info(`REST API v1 Base: http://localhost:${PORT}/api/v1/`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to start API server', err);
  process.exit(1);
});
