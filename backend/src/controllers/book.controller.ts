import { Request, Response, NextFunction } from 'express';
import bookService from '../services/book.service';
import { ApiError } from '../errors/ApiError';

class BookController {
    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await bookService.createBook(req.body);
            res.status(201).json(book);
        } catch (error) {
            next(error);
        }
    }

    async getAllBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await bookService.getAllBooks();
            res.json(books);
        } catch (error) {
            next(error);
        }
    }

    async getBookById(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await bookService.getBookById(req.params.id);
            if (!book) {
                throw ApiError.notFound('Book not found');
            }
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await bookService.updateBook(req.params.id, req.body);
            if (!book) {
                throw ApiError.notFound('Book not found');
            }
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await bookService.deleteBook(req.params.id);
            if (!book) {
                throw ApiError.notFound('Book not found');
            }
            res.json({ message: 'Book deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async searchBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            if (!query) {
                throw ApiError.badRequest('Search query is required');
            }
            const books = await bookService.searchBooks(query);
            res.json(books);
        } catch (error) {
            next(error);
        }
    }
}

export default new BookController();