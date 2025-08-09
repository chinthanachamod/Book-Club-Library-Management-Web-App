import express, {NextFunction, Request, Response} from "express";
import {ReaderModel} from "../models/Reader";
import {BookModel} from "../models/Book";
import {LendingModel} from "../models/Lending";
import {sendOverdueMail} from "../util/email";

// dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
    const totalReaders = await ReaderModel.countDocuments();
    const totalBooks = await BookModel.countDocuments();
    const totalBorrowed = await LendingModel.countDocuments({ status: "lent" });
    const totalOverdue = await LendingModel.countDocuments({ status: "overdue" });

    res.json({ totalReaders, totalBooks, totalBorrowed, totalOverdue });
};

export const getOverdueLendings = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: today },
            status: "overdue",
        });

        const enriched = await Promise.all(
            overdueLendings.map(async (lending) => {
                const reader = await ReaderModel.findOne({ readerId: lending.readerId });
                const book = await BookModel.findOne({ bookId: lending.bookId });

                return {
                    lendId: lending.lendId,
                    bookId: lending.bookId,
                    bookTitle: book?.title || "Unknown Book",
                    readerId: lending.readerId,
                    readerName: reader?.name || "Unknown Reader",
                    email: reader?.email || "Unknown Email",
                    dueDate: lending.dueDate,
                    status: lending.status
                };
            })
        );

        res.status(200).json(enriched);
    } catch (err) {
        next(err);
    }
};

// send overdue mail
export const sendOverdueNotifications = async (_req: Request, res: Response) => {
    try {
        const overdueLendings = await LendingModel.find({ status: "overdue" });

        const emailPromises = overdueLendings.map(async (lending) => {
            const { readerId, bookId, dueDate } = lending;

            const reader = await ReaderModel.findOne({ readerId });
            const book = await BookModel.findOne({ bookId });

            if (!reader || !book) return; // skip if either is missing

            const subject = "Overdue Book Notification";
            const html = `
                <p>Dear ${reader.name},</p>
                <p>This is a reminder that the book <strong>${book.title}</strong> was due on <strong>${new Date(dueDate).toDateString()}</strong>.</p>
                <p>Please return the book as soon as possible to avoid penalties.</p>
                <p>Thank you.</p>
            `;

            return sendOverdueMail(reader.email, subject, html);
        });

        await Promise.all(emailPromises);

        res.status(200).json({ message: "Notification emails sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send notifications" });
    }
};