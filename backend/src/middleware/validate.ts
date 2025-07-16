import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../errors/ApiError';

export const validateRequest = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((error) => ({
                    path: error.path.join('.'),
                    message: error.message,
                }));
                next(ApiError.badRequest(JSON.stringify(errorMessages)));
            } else {
                next(err);
            }
        }
    };
};