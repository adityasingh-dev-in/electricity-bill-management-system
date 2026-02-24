import { Document, Schema } from "mongoose";

export interface IBill extends Document {
    consumerId: Schema.Types.ObjectId;
    meterReadingId: Schema.Types.ObjectId;
    billMonth: string;
    billYear: number;
    unitsConsumed: number;
    energyCharge: number;
    fixedCharge: number;
    totalAmount: number;
    dueDate: Date;
    status: 'pending' | 'paid' | 'overdue';
    generatedBy: Schema.Types.ObjectId;
    generatedAt: Date;
}
