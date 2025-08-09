import {Router} from "express";
import {
    deleteLending,
    getLendingById,
    getLendings,
    markAsReturned,
    saveLending, updateLending
} from "../controllers/lending.controller";
import {sendOverdueNotifications} from "../controllers/dashboard.controller";

const lendingRoutes = Router()

lendingRoutes.post("/", saveLending)
lendingRoutes.put("/:id/return", markAsReturned)
lendingRoutes.get("/", getLendings)
lendingRoutes.get("/:id", getLendingById)
lendingRoutes.delete("/:id", deleteLending)
lendingRoutes.put("/:id", updateLending)
lendingRoutes.post("/notify-overdue", sendOverdueNotifications);

export default lendingRoutes;