import { Document } from "mongoose";

export interface ITariff extends Document {
    ratePerUnit: number;
    fixedCharge: number;
    isActive: boolean;
    createdAt: Date;
}
