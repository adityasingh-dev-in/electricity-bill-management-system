import { Document } from "mongoose";

export interface IDepartment extends Document {
    name: string;
    buildingCode: string;
    location: string;
    contactPerson: string;
    phone: string;
    meterNumber: string;
    createdAt: Date;
}
