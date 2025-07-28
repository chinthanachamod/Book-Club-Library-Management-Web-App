import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { BadRequestError, UnauthorizedError } from '../error';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    // Generate JWT
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
};

// This function retrieves the current user's information based on the authenticated request.
export const getCurrentUser = async (req: express.Request, res: express.Response) => {
    // req.user is set by the authenticate middleware
    // Check if user is authenticated
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new UnauthorizedError('User not found');
    }

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};