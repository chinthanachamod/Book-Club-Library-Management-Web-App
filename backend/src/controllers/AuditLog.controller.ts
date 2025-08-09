import {AuditLogModel} from "../models/AuditLogModel";
import express from "express";

export const getLogs = async (req: express.Request, res: express.Response) => {
    try {
        const logs = await AuditLogModel.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching audit logs" });
    }
}