import { Schema, model } from "mongoose";
import { ITariff } from "../types/tariff.type";

const tariffSchema: Schema<ITariff> = new Schema({
    ratePerUnit: {
        type: Number,
        required: true
    },
    fixedCharge: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default model<ITariff>('Tariff', tariffSchema);
