import { Schema, model } from "mongoose";
import { IMeterReading } from "../types/meterReading.type";

const meterReadingSchema: Schema<IMeterReading> = new Schema({
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    readingMonth: {
        type: String,
        required: true
    },
    readingYear: {
        type: Number,
        required: true
    },
    previousReading: {
        type: Number,
        required: true
    },
    currentReading: {
        type: Number,
        required: true
    },
    unitsConsumed: {
        type: Number,
        required: true
    },
    recordedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recordedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default model<IMeterReading>('MeterReading', meterReadingSchema);
