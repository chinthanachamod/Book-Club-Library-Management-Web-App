import mongoose, { Document } from 'mongoose';
import { IBook } from './book.model';
import { IReader } from './reader.model';

export interface ILending extends Document {
    book: mongoose.Types.ObjectId | IBook;
    reader: mongoose.Types.ObjectId | IReader;
    borrowedDate: Date;
    dueDate: Date;
    returnedDate?: Date;
    status: 'borrowed' | 'returned' | 'overdue';
}

const lendingSchema = new mongoose.Schema<ILending>(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        reader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reader',
            required: true,
        },
        borrowedDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        returnedDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['borrowed', 'returned', 'overdue'],
            default: 'borrowed',
        },
    },
    { timestamps: true }
);

// Update status based on due date and returned date
lendingSchema.pre<ILending>('save', function (next) {
    if (this.isModified('returnedDate') && this.returnedDate) {
        this.status = 'returned';
    } else if (this.dueDate < new Date() && !this.returnedDate) {
        this.status = 'overdue';
    } else {
        this.status = 'borrowed';
    }
    next();
});

const Lending = mongoose.model<ILending>('Lending', lendingSchema);

export default Lending;