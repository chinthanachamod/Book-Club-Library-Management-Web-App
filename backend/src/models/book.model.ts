import mongoose, { Document } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    publicationYear: number;
    genre: string;
    description: string;
    coverImage?: string;
    totalCopies: number;
    availableCopies: number;
}

const bookSchema = new mongoose.Schema<IBook>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        publisher: {
            type: String,
            required: true,
            trim: true,
        },
        publicationYear: {
            type: Number,
            required: true,
        },
        genre: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        coverImage: {
            type: String,
            trim: true,
        },
        totalCopies: {
            type: Number,
            required: true,
            min: 1,
        },
        availableCopies: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;