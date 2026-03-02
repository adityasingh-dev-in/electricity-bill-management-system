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
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

paymentSchema.index({ billId: 1 });
paymentSchema.index({ consumerId: 1, createdAt: -1 });

paymentSchema.pre('save', function () {
    if (!this.transactionId) {
        this.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
});


export default model<IPayment>('Payment', paymentSchema);
