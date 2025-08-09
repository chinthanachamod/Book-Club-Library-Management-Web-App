import express, { NextFunction } from "express";
import {LendingModel} from "../models/Lending";
import { ApiError } from "../error/apiError";
import {BookModel} from "../models/Book";
import {logAction} from "../util/logAction";

// Get all lendings
export const getLendings = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // Auto-update overdue lendings
        await LendingModel.updateMany(
            {
                status: "lent",
                dueDate: { $lt: today }
            },
            {
                $set: { status: "overdue" }
            }
        );

        const lendings = await LendingModel.find();
        res.status(200).json(lendings);
    } catch (err) {
        next(err);
    }
};

// Save (lend) a book
export const saveLending = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const { readerId, bookId, lendDate, dueDate } = req.body;

        const book = await BookModel.findOne({ bookId });
        if (!book || book.qty <= 0) {
            return res.status(400).json({ message: "Book not available" });
        }

        // Save lending
        const lending = new LendingModel({
            readerId,
            bookId,
            lendDate,
            dueDate,
            status: "lent"
        });
        await lending.save();

        // Update book quantity and availability
        book.qty -= 1;
        book.available = book.qty > 0;
        await book.save();

        // Audit Log
        await logAction(
            "lend",
            "admin01", // 🔁 Replace with authenticated user ID if needed
            "lending",
            lending._id.toString(),
            `Book ${book.bookId} lent to reader ${readerId}`
        );

        res.status(201).json({ message: "Lending recorded", lending });
    } catch (error) {
        next(error);
    }
};

// Get lending by ID
export const getLendingById = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id);
        if (!lending) {
            throw new ApiError(404, "Lending record not found");
        }
        res.status(200).json(lending);
    } catch (err) {
        next(err);
    }
};

// Delete lending by ID
export const deleteLending = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const lending = await LendingModel.findById(id);
        if (!lending) {
            throw new ApiError(404, "Lending record not found");
        }

        const book = await BookModel.findOne({ bookId: lending.bookId });
        if (!book) {
            throw new ApiError(404, "Associated book not found");
        }

        // If not returned, update stock before deleting
        if (lending.status !== "returned") {
            book.qty += 1;
            book.available = true;
            await book.save();
        }

        await LendingModel.findByIdAndDelete(id);

        // Audit Log
        await logAction(
            "delete",
            "admin01",
            "lending",
            id,
            `Lending record for book ${lending.bookId} and reader ${lending.readerId} deleted`
        );

        res.status(200).json({ message: "Lending deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// Update lending by ID
export const updateLending = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const updatedLending = await LendingModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        // console.log(updatedLending);
        if (!updatedLending) {
            throw new ApiError(404, "Lending record not found");
        }

        await logAction(
            "update",
            "admin01",
            "lending",
            req.params.id,
            `Lending ${req.params.id} updated`
        );

        res.status(200).json(updatedLending);
    } catch (err) {
        next(err);
    }
};

// Mark as returned
export const markAsReturned = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const lending = await LendingModel.findById(id);
        if (!lending || lending.status === "returned") {
            return res.status(400).json({ message: "Invalid lending" });
        }

        const book = await BookModel.findOne({ bookId: lending.bookId });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Update lending
        lending.status = "returned";
        lending.returnDate = new Date().toISOString().slice(0, 10);
        await lending.save();

        // Increase stock
        book.qty += 1;
        book.available = true;
        await book.save();

        // Audit Log
        await logAction(
            "return",
            "admin01",
            "lending",
            lending._id.toString(),
            `Book ${book.bookId} returned by reader ${lending.readerId}`
        );

        res.status(200).json({ message: "Book returned", lending });
    } catch (error) {
        next(error);
    }
};