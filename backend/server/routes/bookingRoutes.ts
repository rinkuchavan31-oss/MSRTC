                                                                                                                                                                                                  import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             import { authenticate } from '../middlewares/authMiddleware';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Public booking creation (passengers don't have accounts — allow anonymous + optional auth)
router.post('/', rateLimiter(10), bookingController.create);                                                                                             
// Authenticated: only staff or booking owner can view
router.get('/', authenticate, bookingController.getAll);
router.get('/:id', bookingController.getById);
router.post('/:id/cancel', rateLimiter(5), bookingController.cancel);

export default router;
