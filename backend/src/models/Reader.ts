import mongoose from "mongoose";

export type Reader = {
    readerId: string;
    name: string;
    email: string;
    phone: string;
}

const readerSchema = new mongoose.Schema<Reader>({
    readerId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters long"],
        trim: true
    },
    email: {
        type: String,
        unique: [true, "User already exists"],
        required: [true, "Email is required"],
        index: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        unique: true,
        required: [true, "Phone is required"],
        minlength: [10, "Phone number must be at least 10 characters long"],
        trim: true
    }
})

export const ReaderModel = mongoose.model("Reader", readerSchema);