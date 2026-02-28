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

export default model<ITariff>('Tariff', tariffSchema);
