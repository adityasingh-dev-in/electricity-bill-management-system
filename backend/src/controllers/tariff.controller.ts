import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import Tariff from "../models/tariff.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// only for admin
// post /api/v1/tariff/
export const createTariff = asyncHandler(async (req: Request, res: Response) => {
    const { ratePerUnit, fixedCharge, isActive } = req.body;

    // 1. Strict validation for required numeric fields
    if (ratePerUnit === undefined || fixedCharge === undefined) {
        throw new ApiError(400, 'Rate per unit and fixed charge are required');
    }

    // 2. Data construction with type safety
    // Using an interface or specific type instead of 'any' is better for TS
    const tariffData = {
        ratePerUnit: Number(ratePerUnit),
        fixedCharge: Number(fixedCharge),
        isActive: typeof isActive === 'boolean' ? isActive : false
    };

    // 3. Database operation
    const tariff = await Tariff.create(tariffData);

    // 4. Send the response (Don't forget .json()!)
    return res
        .status(201) 
        .json(new ApiResponse(201, tariff, "Tariff created successfully"));
});