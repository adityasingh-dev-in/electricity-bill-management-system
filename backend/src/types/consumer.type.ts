import { Document } from "mongoose";

export interface IConsumer extends Document {
    name: string;
    phone: string;
    houseNumber: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    meterNumber: string;
    createdAt: Date;
}



