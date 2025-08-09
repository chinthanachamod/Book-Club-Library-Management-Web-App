import {Router} from "express";
import {getOverdueLendings} from "../controllers/overdue.controller";

const overdueRoutes = Router()

overdueRoutes.get("/", getOverdueLendings)

export default overdueRoutes;