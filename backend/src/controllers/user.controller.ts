import User from "../models/user.model";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken";

interface authRequest extends Request {
    user?: {
        name: string,
        email: string,
        role: 'staff' | 'admin',
        isActive: boolean
    }
}
interface queryParams {
    name?: string;
    email?: string;
    role?: 'admin' | 'staff';
    isActive?: boolean | string,
    page?: string;
    limit?: string;
    sortBy?: string
}

interface params {
    id?: string
}

interface requestBody {
    name?: string,
    email?: string,
    role?: string,
    isActive?: boolean,
    password?: string,
    confirmPassword?: string
}

//these all are private routes only accesible by staff or admin

export const getUser = asyncHandler(async (req: authRequest, res: Response) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User context not found");
    }

    return res.status(200).json(new ApiResponse(200, { user }, "User fetched successfully"));
});

export const updateUser = asyncHandler(async (req: Request<params, {}, requestBody, {}>, res: Response) => {
    const { id } = req.params;
    const { name, password, confirmPassword } = req.body;

    const updateData: requestBody = {}

    if (name) updateData.name = name;
    if (password && confirmPassword && password === confirmPassword) {
        updateData.password = password
    } else {
        throw new ApiError(400, "password and confirm password must be filled and matched!");
    }
    const checkUser = User.findById(id);
    if (!checkUser) throw new ApiError(400, "no user found")
    const user = await User.findByIdAndUpdate(id, updateData);
    if (!user) throw new ApiError(400, "no user found")

    return res.status(200).json(new ApiResponse(200, user, `data updated successfully`));
})

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    try {
        const decodedToken: any = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        );

        const user = await User.findById(decodedToken?.id);

        if (!user || (user.refreshToken !== incomingRefreshToken)) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const
        };

        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({ accessToken, refreshToken: newRefreshToken, message: "Token refreshed" });

    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});


// these routes are only accessible by admin

export const getUsersByFilter = asyncHandler(async (req: Request<{}, {}, {}, queryParams>, res: Response) => {
    const { email, name, role, isActive, sortBy, page: qPage, limit: qLimit } = req.query;

    // 1. Clean Type Conversion
    const page = Math.max(1, parseInt(qPage || '1'));
    const limit = Math.max(1, parseInt(qLimit || '10'));
    const skip = (page - 1) * limit;

    // 2. Build the Query Object
    const mongoQuery: any = {};

    if (name) mongoQuery.name = { $regex: name, $options: 'i' };
    if (email) mongoQuery.email = { $regex: email, $options: 'i' };
    if (role) mongoQuery.role = role;

    // Explicit string-to-boolean check
    if (isActive === "true") mongoQuery.isActive = true;
    if (isActive === "false") mongoQuery.isActive = false;

    // 3. Database Operations
    // Note: We cast sortBy to string to ensure Mongoose handles the key correctly
    const sortField = typeof sortBy === 'string' ? sortBy : 'createdAt';

    const [users, total] = await Promise.all([
        User.find(mongoQuery)
            .sort({ [sortField]: -1 })
            .skip(skip)
            .limit(limit)
            .select('-password -refreshToken')
            .lean(),
        User.countDocuments(mongoQuery)
    ]);

    // 4. Send Response
    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit)
            }
        }, "Users retrieved successfully")
    );
});


export const getUserById = asyncHandler(async (req: Request<params, {}, {}, {}>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "id parameter is needed")
    }

    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) {
        throw new ApiError(400, "No user Found")
    }

    return res.json(new ApiResponse(200, user, "User found!"));
});

export const updateUserById = asyncHandler(async (req: Request<params, {}, requestBody, {}>, res: Response) => {
    const { name, email, role, isActive } = req.body;
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Id is needed")
    }

    let updateData: requestBody = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && role !== '') updateData.role = role;
    if (isActive !== undefined && typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "No user found")
    }

    return res.status(200).json(new ApiResponse(200, user, "User updated successfully"))
});

export const DeleteUserById = asyncHandler(async (req: Request<params, {}, {}, {}>, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Id is needed")
    }

    const user = await User.findByIdAndDelete(id).select('-password -refreshToken');
    if (!user) {
        throw new ApiError(400, "User not found!");
    }
    return res.status(200).json(new ApiResponse(200, user, "User is Permanently Deleted"))
})