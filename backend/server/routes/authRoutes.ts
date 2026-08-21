import { Router } from 'express';
import { authController } from '../controllers/authController';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// 20 login attempts per minute per IP
router.post('/login', rateLimiter(20), authController.login);
router.post('/register-request', rateLimiter(10), authController.registerRequest);
router.post('/conductor/duty-start', rateLimiter(10), authController.conductorDutyStart);

export default router;
