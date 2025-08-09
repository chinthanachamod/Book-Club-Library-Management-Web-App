import mongoose from "mongoose";

export type Lending = {
    lendId: string,
    readerId: string,
    bookId: string,
    lendDate: string,
    returnDate?: string,
    dueDate: string,
    status: 'lent' | 'returned' | 'overdue';
}

const lendingSchema = new mongoose.Schema<Lending>({
    lendId: {
        type: String,
        unique: true
    },
    bookId: {
        type: String,
        required: true
    },
    readerId: {
        type: String,
        required: true
    },
    lendDate: {
        type: String,
        required: true,
        default: () => new Date().toISOString()
    },
    returnDate: {
        type: String,
        required: false
    },
    dueDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['lent', 'returned', 'overdue'],
        required: true,
        default: 'lent'
    }
})

export const LendingModel = mongoose.model("Lending", lendingSchema);