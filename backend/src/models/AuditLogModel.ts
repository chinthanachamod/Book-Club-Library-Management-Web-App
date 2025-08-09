import mongoose from "mongoose";

export type AuditLogModel = {
    action: string;
    performedBy: string;
    targetType: string;
    targetId: string;
    description: string;
    timestamp: Date;
}

const auditLogSchema = new mongoose.Schema<AuditLogModel>({
    action: {
        type: String,
        required: true
    }, // e.g., 'lend', 'return', 'delete'
    performedBy: {
        type: String,
        required: true
    }, // e.g., user or admin ID or name
    targetType: {
        type: String,
        required: true 
    }, // e.g., 'book', 'reader', 'lending'
    targetId: {
        type: String,
        required: true
    }, // e.g., bookId, lendingId, etc.
    description: {
        type: String
    }, // e.g., 'Book B202500001 lent to R202500001'
    timestamp: {
        type: Date,
        default: Date.now
    },
});

export const AuditLogModel = mongoose.model("AuditLogModel", auditLogSchema);