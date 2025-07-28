import { Request, Response } from 'express';
import Book from '../models/book.model';
import { BadRequestError, NotFoundError } from '../error';
import logger from '../utils/logger';

export const getBooks = async (req: Request, res: Response) => {
    const { search, genre } = req.query;

    let query: any = {};

    if (search) {
        query.$or = [
            { title: { $regex: search as string, $options: 'i' } },
            { author: { $regex: search as string, $options: 'i' } },
            { isbn: { $regex: search as string, $options: 'i' } },
        ];
    }

    if (genre) {
        query.genre = { $regex: genre as string, $options: 'i' };
    }

    const books = await Book.find(query).sort({ title: 1 });

    res.status(200).json(books);
};

export const getBook = async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        throw new NotFoundError('Book not found');
    }

    res.status(200).json(book);
};

export const createBook = async (req: Request, res: Response) => {
    const { isbn } = req.body;

    // Check if book already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
        throw new BadRequestError('Book with this ISBN already exists');
    }

    // Set available copies to total copies if not provided
    if (!req.body.availableCopies) {
        req.body.availableCopies = req.body.totalCopies;
    }

    const book = await Book.create(req.body);

    logger.info(`New book created: ${book.title}`);

    res.status(201).json(book);
};

export const updateBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isbn } = req.body;

    // Check if ISBN is being updated to one that's already in use
    if (isbn) {
        const existingBook = await Book.findOne({ isbn, _id: { $ne: id } });
        if (existingBook) {
            throw new BadRequestError('Book with this ISBN already exists');
        }
    }

    const book = await Book.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!book) {
        throw new NotFoundError('Book not found');
    }

    logger.info(`Book updated: ${book.title}`);

    res.status(200).json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
        throw new NotFoundError('Book not found');
    }

    logger.info(`Book deleted: ${book.title}`);

    res.status(200).json({ message: 'Book deleted successfully' });
};