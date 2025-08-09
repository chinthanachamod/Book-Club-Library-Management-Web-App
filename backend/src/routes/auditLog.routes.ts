import {Router} from "express";
import {getLogs} from "../controllers/AuditLog.controller";

const auditLogRoutes = Router()

auditLogRoutes.get("/", getLogs)

export default auditLogRoutes;