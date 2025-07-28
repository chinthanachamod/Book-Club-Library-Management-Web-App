import { Request, Response } from 'express';
import Lending from '../models/lending.model';
import emailService from '../services/email.service';
import { BadRequestError, NotFoundError } from '../error';
import logger from '../utils/logger';

export const sendOverdueNotifications = async (req: Request, res: Response) => {
    const overdueLendings = await Lending.find({
        dueDate: { $lt: new Date() },
        returnedDate: { $exists: false },
    }).populate('reader');

    if (overdueLendings.length === 0) {
        throw new NotFoundError('No overdue books found');
    }

    const results = await Promise.allSettled(
        overdueLendings.map(async (lending) => {
            try {
                await emailService.sendOverdueNotification(lending._id.toString());
                return {
                    lendingId: lending._id,
                    reader: (lending.reader as any).email,
                    status: 'success',
                };
            } catch (error) {
                return {
                    lendingId: lending._id,
                    reader: (lending.reader as any).email,
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        })
    );

    const successCount = results.filter((r) => r.status === 'fulfilled' && r.value.status === 'success').length;
    const failedCount = results.length - successCount;

    logger.info(`Sent ${successCount} overdue notifications, ${failedCount} failed`);

    res.status(200).json({
        message: `Sent ${successCount} overdue notifications, ${failedCount} failed`,
        results: results.map((r) => r.status === 'fulfilled' ? r.value : r.reason),
    });
};

export const sendOverdueNotification = async (req: Request, res: Response) => {
    const { id } = req.params;

    const lending = await Lending.findById(id).populate('reader');
    if (!lending) {
        throw new NotFoundError('Lending record not found');
    }

    if (lending.returnedDate) {
        throw new BadRequestError('Book already returned');
    }

    if (lending.dueDate >= new Date()) {
        throw new BadRequestError('Book is not overdue');
    }

    try {
        await emailService.sendOverdueNotification(lending._id.toString());
        logger.info(`Sent overdue notification for lending ${lending._id}`);
        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        logger.error(`Failed to send notification: ${error}`);
        throw error;
    }
};