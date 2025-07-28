import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.get('/stats', getStats);

export default router;