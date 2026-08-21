import { Router } from 'express';
import { advisoryController } from '../controllers/advisoryController';

const router = Router();

router.get('/monsoon', advisoryController.getMonsoon);
router.get('/notifications', advisoryController.getNotifications);
router.post('/notifications/:id/read', advisoryController.markRead);

export default router;
