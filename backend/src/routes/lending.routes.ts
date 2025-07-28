import { Router } from 'express';
import {
    getLendings,
    getLending,
    createLending,
    returnBook,
    getOverdueLendings,
} from '../controllers/lending.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin', 'staff']));

router.route('/')
    .get(getLendings)
    .post(createLending);

router.route('/overdue')
    .get(getOverdueLendings);

router.route('/:id/return')
    .put(returnBook);

router.route('/:id')
    .get(getLending);

export default router;