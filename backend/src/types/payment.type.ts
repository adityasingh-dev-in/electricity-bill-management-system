import { Document, Schema } from "mongoose";

export interface IPayment extends Document {
    billId: Schema.Types.ObjectId;
    consumerId: Schema.Types.ObjectId;
    amountPaid: number;
    paymentMethod: 'cash' | 'card' | 'online' | 'other';
    paymentDate: Date;
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
}
