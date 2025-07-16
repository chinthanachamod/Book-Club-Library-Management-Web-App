import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    quantity: number;
    availableQuantity: number;
    genre: string[];
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        isbn: { type: String, required: true, unique: true },
        publishedYear: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 0 },
        availableQuantity: { type: Number, required: true, min: 0 },
        genre: { type: [String], required: true },
    },
    { timestamps: true }
);

// Update availableQuantity to match quantity when creating a new book
BookSchema.pre<IBook>('save', function (next) {
    if (this.isNew) {
        this.availableQuantity = this.quantity;
    }
    next();
});

export default mongoose.model<IBook>('Book', BookSchema);