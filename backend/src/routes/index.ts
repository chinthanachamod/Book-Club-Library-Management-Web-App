import {Router} from "express";
import readerRoutes from "./reader.routes";
import bookRoutes from "./book.routes";
import lendingRoutes from "./lending.routes";
import overdueRoutes from "./overdue.routes";
import authRoutes from "./auth.routes";
import {getDashboardStats, getOverdueLendings} from "../controllers/dashboard.controller";
import auditLogRoutes from "./auditLog.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes)
rootRouter.use("/readers", readerRoutes);
rootRouter.use("/books", bookRoutes);
rootRouter.use("/lendings", lendingRoutes)
rootRouter.use("/overdue", overdueRoutes)
rootRouter.use("/logs", auditLogRoutes)
rootRouter.get("/dashboard/stats", getDashboardStats)
rootRouter.get("/dashboard/overdue", getOverdueLendings)

export default rootRouter;