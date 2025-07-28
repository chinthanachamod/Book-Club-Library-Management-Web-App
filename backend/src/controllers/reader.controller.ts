import { Request, Response } from 'express';
import Reader from '../models/reader.model';
import { BadRequestError, NotFoundError } from '../error';
import logger from '../utils/logger';

export const getReaders = async (req: Request, res: Response) => {
    const { search } = req.query;

    let query = {};

    if (search) {
        query = {
            $or: [
                { name: { $regex: search as string, $options: 'i' } },
                { email: { $regex: search as string, $options: 'i' } },
            ],
        };
    }

    const readers = await Reader.find(query).sort({ createdAt: -1 });

    res.status(200).json(readers);
};

export const getReader = async (req: Request, res: Response) => {
    const reader = await Reader.findById(req.params.id);

    if (!reader) {
        throw new NotFoundError('Reader not found');
    }

    res.status(200).json(reader);
};

export const createReader = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Check if reader already exists
    const existingReader = await Reader.findOne({ email });
    if (existingReader) {
        throw new BadRequestError('Email already in use by another reader');
    }

    const reader = await Reader.create(req.body);

    logger.info(`New reader created: ${reader.email}`);

    res.status(201).json(reader);
};

export const updateReader = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email } = req.body;

    // Check if email is being updated to one that's already in use
    if (email) {
        const existingReader = await Reader.findOne({ email, _id: { $ne: id } });
        if (existingReader) {
            throw new BadRequestError('Email already in use by another reader');
        }
    }

    const reader = await Reader.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!reader) {
        throw new NotFoundError('Reader not found');
    }

    logger.info(`Reader updated: ${reader.email}`);

    res.status(200).json(reader);
};

export const deleteReader = async (req: Request, res: Response) => {
    const reader = await Reader.findByIdAndDelete(req.params.id);

    if (!reader) {
        throw new NotFoundError('Reader not found');
    }

    logger.info(`Reader deleted: ${reader.email}`);

    res.status(200).json({ message: 'Reader deleted successfully' });
};