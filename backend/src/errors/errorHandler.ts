import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';
import { config } from '../config/env';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(config.nodeEnv === 'development' && { stack: err.stack }),
        });
    }

    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
};