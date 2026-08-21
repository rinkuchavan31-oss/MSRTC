import { Router } from 'express';
import { conductorController } from '../controllers/conductorController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use(authenticate, requireRole('conductor', 'admin'));
router.post('/validate-qr', rateLimiter(60), conductorController.validateQr);
router.get('/manifest/:tripId', conductorController.getManifest);
router.post('/toggle-boarding', conductorController.toggleBoarding);
router.post('/issue-spot-ticket', rateLimiter(20), conductorController.issueSpotTicket);

export default router;
