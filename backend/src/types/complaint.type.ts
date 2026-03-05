import { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
    consumerId: Schema.Types.ObjectId;
    createdBy: Schema.Types.ObjectId;
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
