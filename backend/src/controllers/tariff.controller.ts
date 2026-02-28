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

//get /api/v1/tariff/history
interface query{
    limit?:string,
    page?:string,
}

export const getTariffHistory = asyncHandler(async (req:Request<{},{},{},query>,res:Response)=>{

    const limit = Math.max(1, parseInt(req.query.limit || '5'));
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const skip = (page - 1)*limit;

    const [tariff, total] = await Promise.all([
        Tariff.find()
        .sort({ isActive: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
        Tariff.countDocuments()
    ])

    return res.status(200).json(new ApiResponse(200,{
        tariff,
        totalTariff: total
    },"tariff fetched successfully"))
})

//put /api/v1/tariff/:id
interface params{
    id?:string
}

export const updateTariff = asyncHandler(async (req:Request<params,{},{
    ratePerUnit?:number,
    fixedCharge?:number,
},{}>,res:Response)=>{
    const { id } = req.params;
    const { ratePerUnit, fixedCharge } = req.body;

    if(!id){
        throw new ApiError(400,'id needed as params')
    }
    const mongoQuery:any = {}

// Use typeof check to allow 0 as a valid input
    if (typeof ratePerUnit === 'number') mongoQuery.ratePerUnit = ratePerUnit;
    if (typeof fixedCharge === 'number') mongoQuery.fixedCharge = fixedCharge;

    // Check if the update object is empty
    if (Object.keys(mongoQuery).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }


    const tariff = await Tariff.findByIdAndUpdate(
        id,
        { $set: mongoQuery },
        { 
            new: true,           // Return the modified document
            runValidators: true  // Ensure the update obeys Schema rules
        }
    );

    if (!tariff) {
        throw new ApiError(404, 'Tariff not found');
    }

    return res.status(200).json(new ApiResponse(200,tariff,'tariff is updated successfully'))
})

//patch /api/v1/tariff/:id/activate
interface params{
    id?:string
}

export const activateTariff = asyncHandler(async (req:Request<params,{},{},{}>,res:Response)=>{
    const { id } = req.params;

    if(!id){
        throw new ApiError(400,'id needed as params')
    }

    const tariff = await Tariff.findById(id);
    if (!tariff) throw new ApiError(404, "Tariff not found");

    tariff.isActive = true;

    await tariff.save();

    return res.status(200).json(new ApiResponse(200,tariff,'tariff is updated successfully'))
})