import { Request, Response } from 'express';
import Lending from '../models/lending.model';
import Book from '../models/book.model';
import Reader from '../models/reader.model';
import { BadRequestError, NotFoundError } from '../error';
import logger from '../utils/logger';

export const getLendings = async (req: Request, res: Response) => {
    const { status, readerId, bookId } = req.query;

    let query: any = {};

    if (status) {
        query.status = status;
    }

    if (readerId) {
        query.reader = readerId;
    }

    if (bookId) {
        query.book = bookId;
    }

    const lendings = await Lending.find(query)
        .populate('book', 'title author isbn')
        .populate('reader', 'name email')
        .sort({ borrowedDate: -1 });

    res.status(200).json(lendings);
};

export const getLending = async (req: Request, res: Response) => {
    const lending = await Lending.findById(req.params.id)
        .populate('book', 'title author isbn')
        .populate('reader', 'name email');

    if (!lending) {
        throw new NotFoundError('Lending record not found');
    }

    res.status(200).json(lending);
};

export const createLending = async (req: Request, res: Response) => {
    const { bookId, readerId } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
        throw new NotFoundError('Book not found');
    }

    if (book.availableCopies < 1) {
        throw new BadRequestError('No available copies of this book');
    }

    // Check if reader exists
    const reader = await Reader.findById(readerId);
    if (!reader) {
        throw new NotFoundError('Reader not found');
    }

    // Check if reader already has this book borrowed and not returned
    const existingLending = await Lending.findOne({
        book: bookId,
        reader: readerId,
        status: { $in: ['borrowed', 'overdue'] },
    });

    if (existingLending) {
        throw new BadRequestError('Reader already has this book borrowed');
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const lending = await Lending.create({
        book: bookId,
        reader: readerId,
        dueDate,
    });

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    logger.info(`Book ${book.title} lent to ${reader.name}`);

    res.status(201).json(lending);
};

export const returnBook = async (req: Request, res: Response) => {
    const lending = await Lending.findById(req.params.id)
        .populate('book')
        .populate('reader');

    if (!lending) {
        throw new NotFoundError('Lending record not found');
    }

    if (lending.status === 'returned') {
        throw new BadRequestError('Book already returned');
    }

    lending.returnedDate = new Date();
    lending.status = 'returned';
    await lending.save();

    // Update book available copies
    const book = await Book.findById(lending.book);
    if (book) {
        book.availableCopies += 1;
        await book.save();
    }

    logger.info(`Book ${(lending.book as any).title} returned by ${(lending.reader as any).name}`);

    res.status(200).json(lending);
};

export const getOverdueLendings = async (req: Request, res: Response) => {
    const overdueLendings = await Lending.find({
        dueDate: { $lt: new Date() },
        returnedDate: { $exists: false },
    })
        .populate('book', 'title author isbn')
        .populate('reader', 'name email phone')
        .sort({ dueDate: 1 });

    res.status(200).json(overdueLendings);
};