import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use(authenticate, requireRole('admin'));
router.get('/stats', adminController.getStats);
router.get('/trips', adminController.getTrips);
router.post('/tariff/surcharge', rateLimiter(10), adminController.updateSurcharge);

export default router;
