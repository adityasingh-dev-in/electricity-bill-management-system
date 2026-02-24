import { Schema, model } from "mongoose";
import { IBill } from "../types/bill.type";

const billSchema: Schema<IBill> = new Schema({
    consumerId: {
        type: Schema.Types.ObjectId,
        ref: 'Consumer',
        required: true
    },
    meterReadingId: {
        type: Schema.Types.ObjectId,
        ref: 'MeterReading',
        required: true
    },
    billMonth: {
        type: String,
        required: true
    },
    billYear: {
        type: Number,
        required: true
    },
    unitsConsumed: {
        type: Number,
        required: true
    },
    energyCharge: {
        type: Number,
        required: true
    },
    fixedCharge: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    generatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default model<IBill>('Bill', billSchema);
