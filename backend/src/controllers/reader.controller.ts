import { Request, Response, NextFunction } from 'express';
import readerService from '../services/reader.service';
import { ApiError } from '../errors/ApiError';

class ReaderController {
    async createReader(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await readerService.createReader(req.body);
            res.status(201).json(reader);
        } catch (error) {
            next(error);
        }
    }

    async getAllReaders(req: Request, res: Response, next: NextFunction) {
        try {
            const readers = await readerService.getAllReaders();
            res.json(readers);
        } catch (error) {
            next(error);
        }
    }

    async getReaderById(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await readerService.getReaderById(req.params.id);
            if (!reader) {
                throw ApiError.notFound('Reader not found');
            }
            res.json(reader);
        } catch (error) {
            next(error);
        }
    }

    async updateReader(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await readerService.updateReader(req.params.id, req.body);
            if (!reader) {
                throw ApiError.notFound('Reader not found');
            }
            res.json(reader);
        } catch (error) {
            next(error);
        }
    }

    async deleteReader(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await readerService.deleteReader(req.params.id);
            if (!reader) {
                throw ApiError.notFound('Reader not found');
            }
            res.json({ message: 'Reader deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async searchReaders(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            if (!query) {
                throw ApiError.badRequest('Search query is required');
            }
            const readers = await readerService.searchReaders(query);
            res.json(readers);
        } catch (error) {
            next(error);
        }
    }
}

export default new ReaderController();