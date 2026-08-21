import { Router } from 'express';
import { driverController } from '../controllers/driverController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use(authenticate, requireRole('driver', 'admin'));
router.get('/duty', driverController.getDuty);
router.post('/checklist', driverController.submitChecklist);
router.post('/telemetry', rateLimiter(120), driverController.updateTelemetry);
router.post('/sos', driverController.triggerSos);

export default router;
