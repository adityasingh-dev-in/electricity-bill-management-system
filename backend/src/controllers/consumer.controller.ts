import { Request, Response } from "express";
import Consumer from "../models/consumer.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

interface queryParams {
    name?: string;
    meterNumber?: string;
    phone?: string;
    city?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
}

/**
 * @route   POST /api/v1/consumer
 * @desc    Create a new consumer
 * @access  Private
 */
export const createConsumer = asyncHandler(async (req: Request, res: Response) => {
    const { name, phone, houseNumber, area, city, state, pincode, meterNumber } = req.body;

    if ([name, phone, houseNumber, area, city, state, pincode, meterNumber].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required including meter number");
    }

    const existingMeter = await Consumer.findOne({ meterNumber });
    if (existingMeter) {
        throw new ApiError(400, "Consumer with this meter number already exists");
    }

    const consumer = await Consumer.create({
        name,
        phone,
        houseNumber,
        area,
        city,
        state,
        pincode,
        meterNumber
    });

    if (!consumer) {
        throw new ApiError(500, "Something went wrong while creating consumer");
    }

    return res.status(201).json(
        new ApiResponse(201, consumer, "Consumer created successfully")
    );
});

/**
 * @route   GET /api/v1/consumer
 * @desc    Get all consumers with pagination and filtering
 * @access  Private
 */
export const getAllConsumers = asyncHandler(async (req: Request<{}, {}, {}, queryParams>, res: Response) => {
    const { name, meterNumber, phone, city, sortBy, page: qPage, limit: qLimit } = req.query;

    // 1. Pagination setup
    const page = Math.max(1, parseInt(qPage || '1'));
    const limit = Math.max(1, parseInt(qLimit || '10'));
    const skip = (page - 1) * limit;

    // 2. Build the Query Object
    const mongoQuery: any = {};

    if (name) mongoQuery.name = { $regex: name, $options: 'i' };
    if (meterNumber) mongoQuery.meterNumber = { $regex: meterNumber, $options: 'i' };
    if (phone) mongoQuery.phone = { $regex: phone, $options: 'i' };
    if (city) mongoQuery.city = { $regex: city, $options: 'i' };

    // 3. Database Operations
    const sortField = typeof sortBy === 'string' ? sortBy : 'createdAt';

    const [consumers, total] = await Promise.all([
        Consumer.find(mongoQuery)
            .sort({ [sortField]: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Consumer.countDocuments(mongoQuery)
    ]);

    // 4. Send Response
    return res.status(200).json(
        new ApiResponse(200, {
            consumers,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit)
            }
        }, "Consumers retrieved successfully")
    );
});

/**
 * @route   GET /api/v1/consumer/:id
 * @desc    Get single consumer by ID
 * @access  Private
 */
export const getConsumerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Consumer ID is required");
    }

    const consumer = await Consumer.findById(id);

    if (!consumer) {
        throw new ApiError(404, "Consumer not found");
    }

    return res.status(200).json(
        new ApiResponse(200, consumer, "Consumer fetched successfully")
    );
});

/**
 * @route   PUT /api/v1/consumer/:id
 * @desc    Update consumer details
 * @access  Private
 */
export const updateConsumer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, phone, houseNumber, area, city, state, pincode, meterNumber } = req.body;

    const consumer = await Consumer.findByIdAndUpdate(
        id,
        {
            $set: {
                name,
                phone,
                houseNumber,
                area,
                city,
                state,
                pincode,
                meterNumber
            }
        },
        { new: true, runValidators: true }
    );

    if (!consumer) {
        throw new ApiError(404, "Consumer not found");
    }

    return res.status(200).json(
        new ApiResponse(200, consumer, "Consumer updated successfully")
    );
});

/**
 * @route   DELETE /api/v1/consumer/:id
 * @desc    Delete consumer
 * @access  Private
 */
export const deleteConsumer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const consumer = await Consumer.findByIdAndDelete(id);

    if (!consumer) {
        throw new ApiError(404, "Consumer not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Consumer deleted successfully")
    );
});
