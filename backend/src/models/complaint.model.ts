import { Schema, model } from "mongoose";
import { IComplaint } from "../types/complaint.type";

const complaintSchema: Schema<IComplaint> = new Schema({
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    },
    resolvedAt: {
        type: Date
    }
}, { timestamps: true });

export default model<IComplaint>('Complaint', complaintSchema);
