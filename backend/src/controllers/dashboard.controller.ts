// Add backend API for dashboard stats

import { Request, Response } from 'express';
import Book from '../models/book.model';
import Reader from '../models/reader.model';
import Lending from '../models/lending.model';

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalBooks = await Book.countDocuments();
        const availableBooks = await Book.aggregate([
            { $group: { _id: null, total: { $sum: '$availableCopies' } } },
        ]);

        const totalReaders = await Reader.countDocuments();
        const overdueBooks = await Lending.countDocuments({ status: 'overdue' });

        // Simple "change" calculations (in a real app, you'd compare with previous period)
        const booksChange = Math.floor(Math.random() * 10) - 2;
        const availableChange = Math.floor(Math.random() * 10) - 2;
        const readersChange = Math.floor(Math.random() * 10) - 2;
        const overdueChange = Math.floor(Math.random() * 10) - 2;

        res.status(200).json({
            totalBooks,
            availableBooks: availableBooks[0]?.total || 0,
            totalReaders,
            overdueBooks,
            booksChange,
            availableChange,
            readersChange,
            overdueChange,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};