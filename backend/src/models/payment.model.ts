import { Schema, model } from "mongoose";
import { IPayment } from "../types/payment.type";

const paymentSchema: Schema<IPayment> = new Schema({
    billId: {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
        required: true
    },
    consumerId: {
        type: Schema.Types.ObjectId,
        ref: 'Consumer',
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online', 'other'],
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    transactionId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

export default model<IPayment>('Payment', paymentSchema);
