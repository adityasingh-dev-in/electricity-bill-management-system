import { model, Schema } from 'mongoose';

interface IOtp {
    email: string;
    otp: number;
    count: number;
    lastSentAt: Date;
    createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
    email: { type: String, required: true, index: true },
    otp: { type: Number, required: true },
    count: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now} 
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export default model<IOtp>('Otp', otpSchema);