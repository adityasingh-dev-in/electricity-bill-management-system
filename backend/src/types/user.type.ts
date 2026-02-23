import { Types, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'staff' | 'admin';
    refreshToken?: string;
    isActive: boolean;
    comparePassword(password: string): Promise<boolean>;
    generateRefreshToken(): string;
    generateAccessToken(): string;
}