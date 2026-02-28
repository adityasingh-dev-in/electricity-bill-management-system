import { Schema, model } from "mongoose";
import { ITariff } from "../types/tariff.type";

const tariffSchema: Schema<ITariff> = new Schema({
    ratePerUnit: {
        type: Number,
        required: true,
        default: 0
    },
    fixedCharge: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Inside your Tariff Schema file
tariffSchema.pre('save', async function () {
    // Only run this logic if isActive is being set to true
    if (this.isActive) {
        // 'this.constructor' refers to the Tariff model
        await (this.constructor as any).updateMany(
            { _id: { $ne: this._id }, isActive: true }, 
            { $set: { isActive: false } }
        );
    }
});

export default model<ITariff>('Tariff', tariffSchema);
