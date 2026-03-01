import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Consumer from "../models/consumer.model";
import MeterReading from "../models/meterReading.model";
import Bill from "../models/bill.model";
import Tariff from "../models/tariff.model";
import mongoose from "mongoose";

/**
 * @desc    Create Meter Reading & Generate Bill
 * @route   POST /api/v1/meter-reading
 * @access  Private (Staff/Admin)
 */
export const createMeterReading = asyncHandler(async (req: any, res: Response) => {
    const { meterNumber, currentReading, month, year } = req.body;

    if ([meterNumber, currentReading, month, year].some((field) => field === undefined || field === "")) {
        throw new ApiError(400, "All fields (meterNumber, currentReading, month, year) are required");
    }

    // 1. Find Consumer
    const consumer = await Consumer.findOne({ meterNumber });
    if (!consumer) {
        throw new ApiError(404, "Consumer not found with this meter number");
    }

    // 2. Find Previous Reading
    const lastReading = await MeterReading.findOne({ consumerId: consumer._id } as any)
        .sort({ recordedAt: -1 });

    const previousReading = lastReading ? lastReading.currentReading : 0;

    // 3. Validate Current Reading
    if (Number(currentReading) < previousReading) {
        throw new ApiError(400, `Current reading (${currentReading}) cannot be less than previous reading (${previousReading})`);
    }

    // Check if reading already exists for this month/year
    const existingReading = await MeterReading.findOne({
        consumerId: consumer._id,
        readingMonth: month,
        readingYear: year
    } as any);

    if (existingReading) {
        throw new ApiError(400, `Reading already recorded for ${month}/${year}`);
    }

    const unitsConsumed = Number(currentReading) - previousReading;

    // 4. Get Active Tariff
    const activeTariff = await Tariff.findOne({ isActive: true });
    if (!activeTariff) {
        throw new ApiError(500, "No active tariff found. Please contact admin to set a tariff.");
    }

    // 5. Calculate Charges
    const energyCharge = unitsConsumed * activeTariff.ratePerUnit;
    const fixedCharge = activeTariff.fixedCharge;
    const totalAmount = energyCharge + fixedCharge;

    // 6. Database Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create Meter Reading
        const readingData: any = {
            consumerId: consumer._id,
            readingMonth: month,
            readingYear: year,
            previousReading,
            currentReading: Number(currentReading),
            unitsConsumed,
            recordedBy: req.user?._id
        };
        const newReadingArray = await MeterReading.create([readingData], { session });
        const newReading = newReadingArray[0];

        // Calculate Due Date (15 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15);

        // Generate Bill
        const billData: any = {
            consumerId: consumer._id,
            meterReadingId: newReading._id,
            billMonth: month,
            billYear: year,
            unitsConsumed,
            energyCharge,
            fixedCharge,
            totalAmount,
            dueDate,
            generatedBy: req.user?._id
        };
        const newBillArray = await Bill.create([billData], { session });
        const newBill = newBillArray[0];

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(
            new ApiResponse(201, {
                reading: newReading,
                bill: newBill
            }, "Meter reading recorded and bill generated successfully")
        );
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(500, error.message || "Failed to record reading and generate bill");
    }
});

/**
 * @desc    Get All Meter Readings
 * @route   GET /api/v1/meter-reading
 * @access  Private (Staff/Admin)
 */
export const getAllMeterReadings = asyncHandler(async (_req: Request, res: Response) => {
    const readings = await MeterReading.find()
        .populate("consumerId", "name meterNumber area")
        .populate("recordedBy", "name")
        .sort({ recordedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, readings, "Readings fetched successfully")
    );
});

/**
 * @desc    Search Consumer by Meter Number + Last Reading
 * @route   GET /api/v1/meter-reading/consumer/:meterNumber
 * @access  Private (Staff/Admin)
 */
export const getConsumerDetailsByMeter = asyncHandler(async (req: Request, res: Response) => {
    const { meterNumber } = req.params;

    const consumer = await Consumer.findOne({ meterNumber });
    if (!consumer) {
        throw new ApiError(404, "Consumer not found");
    }

    const lastReading = await MeterReading.findOne({ consumerId: consumer._id } as any)
        .sort({ recordedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, {
            consumer,
            lastReading: lastReading || null
        }, "Consumer details and last reading fetched")
    );
});

/**
 * @desc    Get Single Reading Details
 * @route   GET /api/v1/meter-reading/:id
 * @access  Private (Staff/Admin)
 */
export const getMeterReadingById = asyncHandler(async (req: Request, res: Response) => {
    const reading = await MeterReading.findById(req.params.id)
        .populate("consumerId")
        .populate("recordedBy", "name");

    if (!reading) {
        throw new ApiError(404, "Reading not found");
    }

    return res.status(200).json(
        new ApiResponse(200, reading, "Reading fetched successfully")
    );
});

/**
 * @desc    Delete Reading (Only if Bill is Pending)
 * @route   DELETE /api/v1/meter-reading/:id
 * @access  Private (Staff/Admin)
 */
export const deleteMeterReading = asyncHandler(async (req: Request, res: Response) => {
    const readingId = req.params.id;

    // Check if linked bill is pending
    const bill = await Bill.findOne({ meterReadingId: readingId } as any);
    if (bill && bill.status !== 'pending') {
        throw new ApiError(400, `Cannot delete reading as the linked bill is already ${bill.status}`);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await MeterReading.findByIdAndDelete(readingId).session(session);
        if (bill) {
            await (Bill as any).findByIdAndDelete(bill._id).session(session);
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(
            new ApiResponse(200, {}, "Reading and associated bill deleted successfully")
        );
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(500, error.message || "Failed to delete reading");
    }
});
