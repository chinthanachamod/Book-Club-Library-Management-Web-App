import { Router } from 'express';
import {
    sendOverdueNotifications,
    sendOverdueNotification,
} from '../controllers/notification.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin', 'staff']));

router.route('/overdue')
    .post(sendOverdueNotifications);

router.route('/overdue/:id')
    .post(sendOverdueNotification);

export default router;