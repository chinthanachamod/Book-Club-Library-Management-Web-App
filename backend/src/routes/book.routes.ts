import { Router } from 'express';
import bookController from '../controllers/book.controller';
import { validateRequest } from '../middleware/validate';
import { bookSchema } from '../validations/book.validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, bookController.getAllBooks);
router.get('/search', authenticate, bookController.searchBooks);
router.get('/:id', authenticate, bookController.getBookById);
router.post('/', authenticate, validateRequest(bookSchema), bookController.createBook);
router.put('/:id', authenticate, validateRequest(bookSchema), bookController.updateBook);
router.delete('/:id', authenticate, bookController.deleteBook);

export default router;