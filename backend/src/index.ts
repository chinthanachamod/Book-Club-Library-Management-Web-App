/*
import express from "express";
import cors from "cors"
import {connectDB} from "./db/mongo";
import dotenv from "dotenv";
import rootRouter from "./routes";
import {errorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser"

dotenv.config();
const app = express()
app.use(express.json());
app.use(cookieParser())

// localhost:3000
const port = process.env.PORT || 3000;

// handle cors
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    method: "GET,HEAD,POST,PUT,PATCH,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use("/api", rootRouter)
app.use(errorHandler)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })
})*/
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/mongo";
import rootRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// CORS Configuration: allow multiple origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5177'];

const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Log origin for debugging
app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin);
    next();
});

app.use(cors(corsOptions));

// Routes
app.use("/api", rootRouter);

// Error Handler Middleware
app.use(errorHandler);

// Connect to DB and Start Server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server started on http://localhost:${port}`);
    });
});
