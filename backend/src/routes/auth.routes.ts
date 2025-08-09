import {Router} from "express";
import {getAllUsers, login, logout, refresh, Signup} from "../controllers/auth.controller";
import {authenticateToken} from "../middlewares/authenticateToken";

const userRouters = Router();

userRouters.post("/signup", Signup);
userRouters.get("/users", authenticateToken, getAllUsers)
userRouters.post("/login", login);
userRouters.post("/refresh-token", refresh)
userRouters.post("/logout", logout);

export default userRouters;