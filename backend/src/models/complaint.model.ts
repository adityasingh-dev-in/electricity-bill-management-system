import { Schema, model } from "mongoose";
import { IComplaint } from "../types/complaint.type";

const complaintSchema: Schema<IComplaint> = new Schema({
    consumerId: {
        type: Schema.Types.ObjectId,
        ref: 'Consumer',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    importance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
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
