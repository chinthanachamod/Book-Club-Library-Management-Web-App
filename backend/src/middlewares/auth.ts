import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {ForbiddenError, UnauthorizedError} from '../error';

// This file contains middleware for authentication and authorization in an Express application.
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new UnauthorizedError('Authentication required');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            name: string;
            email: string;
            role: string;
        };
        req.user = decoded;
        next();
    } catch (error) {
        throw new UnauthorizedError('Invalid token');
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ForbiddenError('Insufficient permissions');
        }
        next();
    };
};