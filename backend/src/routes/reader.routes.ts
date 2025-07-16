import { Router } from 'express';
import readerController from '../controllers/reader.controller';
import { validateRequest } from '../middleware/validate';
import { readerSchema } from '../validations/reader.validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, readerController.getAllReaders);
router.get('/search', authenticate, readerController.searchReaders);
router.get('/:id', authenticate, readerController.getReaderById);
router.post('/', authenticate, validateRequest(readerSchema), readerController.createReader);
router.put('/:id', authenticate, validateRequest(readerSchema), readerController.updateReader);
router.delete('/:id', authenticate, readerController.deleteReader);

export default router;