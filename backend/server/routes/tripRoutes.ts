import { Router } from 'express';
import { tripController } from '../controllers/tripController';

const router = Router();

router.get('/search', tripController.search);
router.get('/locations/popular', tripController.getPopularLocations);
router.get('/:id/seats', tripController.getSeats);
router.get('/:id', tripController.getById);

export default router;
