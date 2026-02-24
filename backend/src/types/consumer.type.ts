import { Document } from "mongoose";

export interface IConsumer extends Document {
    name: string;
    buildingCode: string;
    location: string;
    contactPerson: string;
    phone: string;
    meterNumber: string;
    createdAt: Date;
}
