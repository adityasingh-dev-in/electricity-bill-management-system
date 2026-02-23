import { Document, Schema } from "mongoose";

export interface IMeterReading extends Document {
    departmentId: Schema.Types.ObjectId;
    readingMonth: string;
    readingYear: number;
    previousReading: number;
    currentReading: number;
    unitsConsumed: number;
    recordedBy: Schema.Types.ObjectId;
    recordedAt: Date;
}
