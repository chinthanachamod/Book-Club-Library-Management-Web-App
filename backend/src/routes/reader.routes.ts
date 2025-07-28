import { Router } from 'express';
import {
    getReaders,
    getReader,
    createReader,
    updateReader,
    deleteReader,
} from '../controllers/reader.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin', 'staff']));

router.route('/')
    .get(getReaders)
    .post(createReader);

router.route('/:id')
    .get(getReader)
    .put(updateReader)
    .delete(deleteReader);

export default router;