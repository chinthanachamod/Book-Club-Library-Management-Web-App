import express, {NextFunction} from "express";
import mongoose from "mongoose";
import {ApiError} from "../error/apiError";

export const errorHandler = (error: any, req: express.Request, res: express.Response, next: NextFunction) => {
    if (error instanceof mongoose.Error) {
        res.status(400).json({message: error.message});
        return;
    }

    if (error.code === 11000) {
        res.status(400).json({ message: "Duplicate value already exists in the database" });
        return;
    }

    if (error instanceof ApiError) {
        res.status(error.status).json({message: error.message});
        return;
    }
    res.status(500).json({message: "Internal Server Error"});
}