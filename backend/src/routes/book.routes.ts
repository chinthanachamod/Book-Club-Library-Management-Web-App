import { Router } from 'express';
import {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} from '../controllers/book.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin', 'staff']));

router.route('/')
    .get(getBooks)
    .post(createBook);

router.route('/:id')
    .get(getBook)
    .put(updateBook)
    .delete(deleteBook);

export default router;