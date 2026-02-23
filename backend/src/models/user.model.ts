import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Schema, model } from "mongoose"
import { IUser } from "../types/user.type"
import dotenv from 'dotenv'
import { timeStamp } from "console"
dotenv.config()



const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['staff', 'admin'],
        default: 'staff'
    },
    refreshToken: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.pre('save', async function () {
    if (!this.isModified("password")) {
        return
    }
    let saltRound = 10
    const hashedPassword = await bcrypt.hash(this.password as string, saltRound);
    this.password = hashedPassword;
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) {
        return false
    };
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({
        id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET as string || "",
        { expiresIn: (process.env.REFRESH_TOKEN_EXPIRY as any) || "30d" }
    )
    return token;
}

userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({
        id: this._id,
    },
        process.env.ACCESS_TOKEN_SECRET as string || "",
        { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as any) || "1d" }
    )
    return token;
}

userSchema.index({ name: 'text', email: 'text'});
userSchema.index({ createdAt: -1})

export default model<IUser>('User', userSchema);