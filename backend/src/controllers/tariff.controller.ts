import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import Tariff from "../models/tariff.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// only for admin
// post /api/v1/tariff/
export const createTariff = asyncHandler(async (req: Request, res: Response) => {
    const { ratePerUnit, fixedCharge, isActive } = req.body;

    if (ratePerUnit === undefined || fixedCharge === undefined) {
        throw new ApiError(400, 'Rate per unit and fixed charge are required');
    }

    // Notice we don't need the updateMany here anymore if using the Hook above!
    const tariff = await Tariff.create({
        ratePerUnit: Number(ratePerUnit),
        fixedCharge: Number(fixedCharge),
        isActive: Boolean(isActive) 
    });

    return res.status(201).json(
        new ApiResponse(201, tariff, "Tariff created successfully")
    );
});

// get /api/v1/tariff/
export const getActiveTariff = asyncHandler(async (req:Request,res:Response)=>{
    const tariff = await Tariff.findOne({isActive : true})
    .sort({['createdAt']:-1})
    .lean()
    if(!tariff){
        throw new ApiError(404,"no Active Tariff Found")
    }
    return res.status(200).json(new ApiResponse(200,tariff,"active tariff found"))
})

export const getTariffHistory = asyncHandler(async (req:Request,res:Response)=>{
    
})