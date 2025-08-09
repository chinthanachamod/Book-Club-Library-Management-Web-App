import express, {NextFunction} from "express";
import {ApiError} from "../error/apiError";
import jwt, {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";

export const authenticateToken = (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]

        if (!token) {
            throw new ApiError(403, "Access Token Not Found");
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
            if (error) {
                if (error instanceof TokenExpiredError) {
                    throw new ApiError(403, "Access Token Expired");
                } else if (error instanceof JsonWebTokenError) {
                    throw new ApiError(403, "Invalid Access Token");
                }else {
                    throw new ApiError(403, "Error verifying access Token");
                }
            }

            if (!decoded || typeof decoded === "string") {
                throw new ApiError(500, "Access token payload error");
            }

            next()
        })
    }catch(err) {
        next(err)
    }
}