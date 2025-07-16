import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionStatus {
    BORROWED = 'BORROWED',
    RETURNED = 'RETURNED',
    OVERDUE = 'OVERDUE',
}

export interface ITransaction extends Document {
    book: mongoose.Types.ObjectId;
    reader: mongoose.Types.ObjectId;
    borrowDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        reader: { type: Schema.Types.ObjectId, ref: 'Reader', required: true },
        borrowDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },
        returnDate: { type: Date },
        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            default: TransactionStatus.BORROWED,
        },
    },
    { timestamps: true }
);

// Update status to OVERDUE if book is not returned by due date
TransactionSchema.pre<ITransaction>('save', function (next) {
    if (this.isModified('status') && this.status === TransactionStatus.RETURNED) {
        this.returnDate = new Date();
    } else if (
        !this.returnDate &&
        this.dueDate < new Date() &&
        this.status !== TransactionStatus.RETURNED
    ) {
        this.status = TransactionStatus.OVERDUE;
    }
    next();
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);