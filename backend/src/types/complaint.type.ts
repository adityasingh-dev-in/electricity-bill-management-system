import { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
    departmentId: Schema.Types.ObjectId;
    description: string;
    status: 'pending' | 'resolved';
    createdAt: Date;
    resolvedAt?: Date;
}
