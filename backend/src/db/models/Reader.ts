import mongoose, { Document, Schema } from 'mongoose';

export interface IReader extends Document {
    name: string;
    email: string;
    phone: string;
    address: string;
    membershipDate: Date;
    isActive: boolean;
    borrowedBooks: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReaderSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        membershipDate: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
        borrowedBooks: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IReader>('Reader', ReaderSchema);