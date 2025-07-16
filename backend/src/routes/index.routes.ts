import { Router } from 'express';
import bookRoutes from './book.routes';
import readerRoutes from './reader.routes';
import authRoutes from './auth.routes';
import transactionRoutes from './transaction.routes';

const router = Router();

router.use('/books', bookRoutes);
router.use('/readers', readerRoutes);
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);

export default router;