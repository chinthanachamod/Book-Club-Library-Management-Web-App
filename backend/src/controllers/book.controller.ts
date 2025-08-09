import express, {NextFunction} from "express";
import {BookModel} from "../models/Book";
import {ApiError} from "../error/apiError";
import {getNextId} from "../util/generateId";
import {logAction} from "../util/logAction";

export const getBooks = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const books = await BookModel.find()

        res.status(200).json(books)
    }catch(err) {
        next(err)
    }
}

// Return only bookIds
export const getBookIds = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const books = await BookModel.find({}, { bookId: 1, _id: 0 });
        const bookIds = books.map(book => book.bookId);
        res.status(200).json(bookIds)
    } catch (err) {
        next(err);
    }
};

export const saveBook = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const bookId = await getNextId("book")
        console.log(bookId)
        const book = new BookModel({
            ...req.body,
            bookId
        })

        await book.save()

        // Audit Log
        await logAction(
            "save",
            "admin01",
            "book",
            book.bookId,
            `Book ${book.bookId} is saved`
        );

        res.status(200).json(book)
    }catch (err) {
        next(err)
    }
}

export const getBooksById = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id)

        if (!book) {
            throw new ApiError(404, "Book not found")
        }
        res.status(200).json(book)
    }catch (err) {
        next(err)
    }
}

export const deleteBook = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id)

        const deleteBook = await BookModel.findByIdAndDelete(req.params.id)

        if (!deleteBook) {
            throw new ApiError(404, "Book not found")
        }

        // Audit Log
        await logAction(
            "delete",
            "admin01",
            "book",
            req.params.id,
            `${book?.bookId} is deleted`
        );

        res.status(200).json(deleteBook)
    }catch (err) {
        next(err)
    }
}

export const updateBook = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const { qty } = req.body;

        // Update availability based on qty
        if (typeof qty === 'number') {
            req.body.available = qty > 0;
        }

        const updateBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updateBook) {
            throw new ApiError(404, "Book not found");
        }

        // Audit Log
        await logAction(
            "update",
            "admin01",
            "book",
            req.params.id,
            `Book ${req.params.id} updated`
        );

        res.status(200).json(updateBook);
    } catch (err) {
        next(err);
    }
}

