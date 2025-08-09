import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        console.log("MongoDB Connected");
    }catch (error) {
        console.log("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}