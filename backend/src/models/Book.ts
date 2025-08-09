import mongoose from "mongoose";

export type Book = {
    bookId: string;
    title: string;
    author: string;
    isbn: string;
    available: boolean;
    qty: number;
}

const bookSchema = new mongoose.Schema<Book>({
    bookId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name should be at least 2 characters long"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Author name is required"],
        minlength: [2, "Author should be at least 2 characters long"],
        trim: true,
        unique: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    available: {
        type: Boolean,
        default: false
    },
    qty: {
        type: Number,
        required: true,
        default: 1
    }
})

// Export the model
export const BookModel = mongoose.model("Book", bookSchema);