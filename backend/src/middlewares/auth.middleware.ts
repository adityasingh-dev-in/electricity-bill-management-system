import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

interface authRequest extends Request {
    user?: {
        name: string,
        email: string,
        role: 'staff' | 'admin',
        isActive: boolean
    }
}


export const verifyJWT = asyncHandler(async (req: authRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        const user = await User.findById(decodedToken?.id).select("-password -refreshToken");

        if (!user || !user.isActive) {
            throw new ApiError(401, "Invalid or Inactive User");
        }

        req.user = user;
        next();
    } catch (error: any) {
        // If expired, send 401. The frontend interceptor will catch this.
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});