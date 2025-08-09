import mongoose from "mongoose";

type User = {
    id: string,
    name: string,
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema<User>({
    id: {
        type: String,
        unique: true,
    },

    name: {
        type: String,
        minlength: [2, "Name must be at least 2 characters long"],
        required: [true, "Name is required"],
        trim: true
    },

    email: {
        type: String,
        unique: [true, "User is required"],
        index: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
    },

    password: {
        type: String
    }
})

export const UserModel = mongoose.model("User", userSchema);