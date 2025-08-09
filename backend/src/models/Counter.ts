import mongoose, { Document, Schema } from "mongoose";

export interface ICounter extends Document {
    _id: string; // e.g., "reader_2025", "book_2025", "lending_2025"
    seq: number;
}

const counterSchema = new Schema<ICounter>({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

// Create compound unique index on _id to ensure no duplicates
counterSchema.index({ _id: 1 }, { unique: true });

export const CounterModel = mongoose.model<ICounter>("Counter", counterSchema);
