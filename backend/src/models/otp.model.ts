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
    count: { type: Number, default: 1 },
    lastSentAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now, expires: 300 } 
});

export default model<IOtp>('Otp', otpSchema);