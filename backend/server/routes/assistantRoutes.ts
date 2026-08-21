import { Router } from 'express';
import { assistantController } from '../controllers/assistantController';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Rate limited to 30 assistant messages per minute
router.post('/chat', rateLimiter(30), assistantController.chat);

export default router;
