import { Document, Types } from "mongoose";

export interface IComplaint extends Document {
    consumerId: Types.ObjectId;
    createdBy: Types.ObjectId;
    Title: string;
    description: string;
    area: string;
    city: string;
    pincode: number;
    importance: 'low' | 'medium' | 'high';
    status: 'pending' | 'resolved';
    createdAt: Date;
    resolvedAt?: Date;
}
