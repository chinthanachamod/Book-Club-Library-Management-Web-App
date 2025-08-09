import express, {NextFunction} from "express";
import {UserModel} from "../models/User";
import bcrypt = require("bcrypt");
import {ApiError} from "../error/apiError";
import jwt, {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';
import {Error} from "mongoose";

const createAccessToken = (userId: string) => {
    return jwt.sign(
        {userId},
        process.env.ACCESS_TOKEN_SECRET!, // meka aniwaryenma thiyanwa kiyala thamai "!" meken kiyanne
        {expiresIn: '30s'}
    )
}

const refreshToken = (userId: string) => {
    return jwt.sign(
        {userId},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: '7d'}
    )
}

export const Signup = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const {name, email, password} = new UserModel(req.body);
        const SALT = 10;
        const hashedPassword = await bcrypt.hash(password, SALT);
        const user = new UserModel({
            email,
            name,
            password: hashedPassword
        });
        await user.save();
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email
        }
        res.status(201).json(userWithoutPassword);
    }catch(err: any){
        next(err);
    }
}

export const getAllUsers = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const user = await UserModel.find().select("-password");
        res.status(200).json(user);
    }
    catch(err: any){
        next(err);
    }
}

export const login = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email})
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new ApiError(401, "Invalid Credentials");
        }

        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createAccessToken(user._id.toString());

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            maxAge:  7 * 24 * 60 * 60 * 1000,
            path: "api/auth/refresh-token",
        });

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken
        }
        res.status(200).json(userWithoutPassword);
    }catch(err: any){
        console.log("error", err);
        next(err);
    }
}

export const refresh = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const token = req.cookies?.refreshToken
        if (!token) {
            throw new ApiError(401, "Refresh Token Missing");
        }

        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET!,
            async (error: Error | null, decoded: string | jwt.JwtPayload | undefined) => {
                if (error) {
                    if (error instanceof TokenExpiredError) {
                        return next(new ApiError(401, "Refresh Token Expired"));
                    } else if (error instanceof JsonWebTokenError) {
                        return next(new ApiError(401, "Invalid Refresh Token"));
                    }else {
                        return next(new ApiError(401, "Error verifying refresh Token"));
                    }
                }

                if (!decoded || typeof decoded === "string") {
                    throw new ApiError(500, "Refresh token playload error")
                }

                const userId = decoded.userId as string
                const user = await UserModel.findById(userId)

                if (!user) {
                    throw new ApiError(401, "User not found")
                }

                const newAccesToken = createAccessToken(user._id.toString())
                res.status(200).json({accessToken: newAccesToken})
            }
        )
    }catch(err: any){
        next(err);
    }
}

export const logout = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try{
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: isProduction,
            expires: new Date(0),
            path: "api/auth/refresh-token"
        })

        res.status(200).json({message: "Logout successful"})
    }catch(err: any){
        next(err);
    }
}