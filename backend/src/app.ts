import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import httpError from 'http-errors';
import { config } from 'dotenv';

import authRoutes from './routes/auth.routes';
import readerRoutes from './routes/reader.routes';
import bookRoutes from './routes/book.routes';
import lendingRoutes from './routes/lending.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';

config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/readers', readerRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/lendings', lendingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// 404 handler
app.use((req, res, next) => {
    next(httpError(404, 'Not found'));
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

export default app;


