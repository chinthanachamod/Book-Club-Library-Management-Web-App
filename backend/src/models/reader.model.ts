import mongoose, { Document } from 'mongoose';

export interface IReader extends Document {
    name: string;
    email: string;
    phone: string;
    address: string;
    membershipDate: Date;
}

const readerSchema = new mongoose.Schema<IReader>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        membershipDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Reader = mongoose.model<IReader>('Reader', readerSchema);

export default Reader;