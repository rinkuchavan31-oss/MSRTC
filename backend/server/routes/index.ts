import { Router } from 'express';
import authRoutes from './authRoutes';
import tripRoutes from './tripRoutes';
import bookingRoutes from './bookingRoutes';
import conductorRoutes from './conductorRoutes';
import adminRoutes from './adminRoutes';
import driverRoutes from './driverRoutes';
import assistantRoutes from './assistantRoutes';
import advisoryRoutes from './advisoryRoutes';
import { sendSuccess } from '../utils/response';

const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, {
    status: 'ok',
    service: 'msrtc-nextgen-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Resource Sub-routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/trips', tripRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/conductor', conductorRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/driver', driverRoutes);
apiRouter.use('/assistant', assistantRoutes);
apiRouter.use('/advisories', advisoryRoutes);

export default apiRouter;
