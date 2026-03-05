import Complaint from "../models/complaint.model";
import Consumer from "../models/consumer.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from "express";
import mongoose from "mongoose";

/**
 * @description Get all complaints with filters
 * @route GET /api/v1/complaint
 * @access Private/Admin
 */
export const getAllComplaints = asyncHandler(async (req: Request, res: Response) => {
    // 1. Destructure with defaults and cast numbers early
    const { area, city, pincode, importance, status } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // 2. Build filter object (using partial for type safety if possible)
    const filter: Record<string, any> = {};

    if (area) filter.area = area;
    if (city) filter.city = { $regex: new RegExp(city as string, 'i') }; // Case-insensitive example
    if (pincode) filter.pincode = Number(pincode);
    if (importance) filter.importance = importance;
    if (status) filter.status = status;

    // 3. Execute queries in parallel for better performance
    const [complaints, total] = await Promise.all([
        Complaint.find(filter)
            .populate("consumerId", "name meterNumber")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(), // Use .lean() for faster, read-only performance
        Complaint.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            complaints,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }, "Complaints fetched successfully")
    );
});

/**
 * @description Get complaint details by ID
 * @route GET /api/v1/complaint/:id
 * @access Private
 */
export const getComplaintById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // 1. Validate ID Format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Complaint ID");
    }

    // 2. Fetch with lean() and specific field selection
    const complaint = await Complaint.findById(id)
        .populate("consumerId", "name meterNumber phoneNumber") // Avoid sensitive data
        .populate("createdBy", "name email")
        .lean();

    // 3. Handle Not Found
    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }


    return res.status(200).json(
        new ApiResponse(200, complaint, "Complaint details fetched successfully")
    );
});

/**
 * @description Get all complaints by consumer meter number
 * @route GET /api/v1/complaint/consumer/:meterNumber
 * @access Private
 */
export const getConsumerComplaints = asyncHandler(async (req: Request, res: Response) => {
    const { meterNumber } = req.params;

    // 1. Check if consumer exists first
    const consumer = await Consumer.findOne({ meterNumber }).select("_id").lean();

    if (!consumer) {
        throw new ApiError(404, "No consumer found with this meter number");
    }

    // 2. Fetch complaints using the ID found
    // Added .lean() for performance since this is read-only
    const complaints = await Complaint.find({ consumerId: consumer._id } as any)
        .populate("consumerId", "name meterNumber")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, complaints, "Consumer complaints fetched successfully")
    );
});

/**
 * @description Create a new complaint
 * @route POST /api/v1/complaint/
 * @access Private
 */
export const createComplaint = asyncHandler(async (req: Request, res: Response) => {
    const { consumerId, Title, description, area, city, pincode, importance } = req.body;

    if (!consumerId || !Title || !description || !area || !city || !pincode) {
        throw new ApiError(400, "All fields are required");
    }

    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
        throw new ApiError(404, "Consumer not found");
    }

    const complaint = await Complaint.create({
        consumerId,
        createdBy: (req as any).user?._id,
        Title,
        description,
        area,
        city,
        pincode,
        importance: importance || 'medium',
        status: 'pending'
    });

    if (!complaint) {
        throw new ApiError(500, "Something went wrong while creating the complaint");
    }

    return res.status(201).json(
        new ApiResponse(201, complaint, "Complaint created successfully")
    );
});

/**
 * @description Update complaint data
 * @route PUT /api/v1/complaint/
 * @access Private
 */
export const updateComplaint = asyncHandler(async (req: Request, res: Response) => {
    const { id, Title, description, area, city, pincode, importance } = req.body;

    if (!id) {
        throw new ApiError(400, "Complaint ID is required");
    }

    const complaint = await Complaint.findByIdAndUpdate(
        id,
        {
            $set: {
                Title,
                description,
                area,
                city,
                pincode,
                importance
            }
        },
        { new: true }
    );

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    return res.status(200).json(
        new ApiResponse(200, complaint, "Complaint updated successfully")
    );
});

/**
 * @description Update complaint status
 * @route PATCH /api/v1/complaint/status
 * @access Private/Admin
 */
export const updateComplaintStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id, status } = req.body;

    if (!id || !status) {
        throw new ApiError(400, "Complaint ID and status are required");
    }

    if (!['pending', 'resolved'].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'pending' or 'resolved'");
    }

    const updateData: any = { status };
    if (status === 'resolved') {
        updateData.resolvedAt = new Date();
    } else {
        updateData.resolvedAt = null;
    }

    const complaint = await Complaint.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    );

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    return res.status(200).json(
        new ApiResponse(200, complaint, `Complaint status updated to ${status}`)
    );
});

/**
 * @description Delete a complaint
 * @route DELETE /api/v1/complaint/delete/:complaintID
 * @access Private/Admin
 */
export const deleteComplaint = asyncHandler(async (req: Request, res: Response) => {
    const { complaintID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(complaintID)) {
        throw new ApiError(400, "Invalid Complaint ID");
    }

    const complaint = await Complaint.findByIdAndDelete(complaintID);

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Complaint deleted successfully")
    );
});
