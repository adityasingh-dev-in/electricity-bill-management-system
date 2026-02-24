import { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
    consumerId: Schema.Types.ObjectId;
    description: string;
    status: 'pending' | 'resolved';
    createdAt: Date;
    resolvedAt?: Date;
}
