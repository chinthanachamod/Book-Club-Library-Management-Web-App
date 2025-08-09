import {LendingModel} from "../models/Lending";
import express, {NextFunction} from "express";

// Get overdue lendings
export const getOverdueLendings = async (_req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: today },
            status: "overdue",
        });
        res.status(200).json(overdueLendings);
    } catch (err) {
        next(err);
    }
};