import express, {NextFunction} from "express";
import {ReaderModel} from "../models/Reader";
import {ApiError} from "../error/apiError";
import {getNextId} from "../util/generateId";
import {logAction} from "../util/logAction";

export const getReaders = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const readers = await ReaderModel.find()
        res.status(200).json(readers)
    }catch(err: any) {
        next(err)
    }
}

// Return only names
/*export const getReaderNames = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const readers = await ReaderModel.find({}, { name: 1, _id: 0 });
        const names = readers.map(reader => reader.name);
        res.status(200).json(names)
    } catch (err) {
        next(err);
    }
};*/

// Return only readerIds
export const getReaderIds = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const readers = await ReaderModel.find({}, { readerId: 1, _id: 0 });
        const readerIds = readers.map(reader => reader.readerId);
        res.status(200).json(readerIds)
    } catch (err) {
        next(err);
    }
};

export const createReader = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const readerId = await getNextId("reader")
        const reader = new ReaderModel({
            ...req.body,
            readerId
        });
        await reader.save()

        // Audit Log
        await logAction(
            "save",
            "admin01",
            "reader",
            reader.readerId,
            `Reader ${reader.readerId} is saved`
        );

        res.status(200).json(reader)
    }catch(err: any) {
        next(err)
    }
}

export const getReadersById = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.id)

        if (!reader) {
            throw new ApiError(404, "No reader found")
        }
        res.status(200).json(reader)
    }catch (err: any) {
        next(err)
    }
}

export const deleteReader = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.id)

        const deleteReader = await ReaderModel.findByIdAndDelete(req.params.id)

        if (!deleteReader) {
            throw new ApiError(404, "No reader found")
        }

        // Audit Log
        await logAction(
            "delete",
            "admin01",
            "reader",
            req.params.id,
            `${reader?.readerId} is deleted`
        );

        res.status(200).json(deleteReader)
    }catch(err: any) {
        next(err)
    }
}

export const updateReader = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const updatedReader = await ReaderModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!updatedReader) {
            throw new ApiError(404, "No reader found")
        }

        // Audit Log
        await logAction(
            "update",
            "admin01",
            "reader",
            req.params.id,
            `Reader ${req.params.id} updated`
        );

        res.status(200).json(updatedReader)
    }catch(err: any) {
        next(err)
    }
}