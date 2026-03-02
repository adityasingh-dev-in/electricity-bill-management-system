import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Payment from "../models/payment.model";
import Bill from "../models/bill.model";
import mongoose from "mongoose";

/**
 * @desc    Record a new payment
 * @route   POST /api/v1/payment
 * @access  Private
 */
export const recordPayment = asyncHandler(async (req: Request, res: Response) => {
    const { billId, consumerId, amountPaid, paymentMethod } = req.body;

    // 1. Validation
    if (!billId || !consumerId || !amountPaid || !paymentMethod) {
        throw new ApiError(400, "All fields are required");
    }

    // Start a Session for the Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Find Bill within the session
        const bill = await Bill.findById(billId).session(session);
        if (!bill) throw new ApiError(404, "Bill not found");

        if (bill.status === 'paid') {
            throw new ApiError(400, "This bill is already paid");
        }

        // 3. Optional: Verify amount (Strictly recommended)
        if (amountPaid < bill.totalAmount) {
            throw new ApiError(400, `Insufficient amount. Bill total is ${bill.totalAmount}`);
        }

        // 4. Create Payment
        const [payment] = await Payment.create([{
            billId,
            consumerId,
            amountPaid,
            paymentMethod,
            status: 'completed'
        }], { session });

        // 5. Update Bill Status
        bill.status = 'paid';
        bill.paidAt = new Date();
        await bill.save({ session });

        // Commit the changes to the database
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(
            new ApiResponse(201, payment, "Payment recorded and bill updated successfully")
        );

    } catch (error) {
        // If anything fails, undo all changes (payment won't be created, bill won't be updated)
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw to be caught by asyncHandler
    } finally {
        session.endSession();
    }
});

/**
 * @desc    Get all payments
 * @route   GET /api/v1/payment
 * @access  Private
 */
interface PaymentQuery {
    page?: string;
    limit?: string;
    consumerId?: string;
    paymentMethod?: string;
}

export const getAllPayments = asyncHandler(async (req: Request<{}, {}, {}, PaymentQuery>, res: Response) => {
    // 1. Pagination & Sanitization
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // 2. Dynamic Filtering
    const filter: any = {};
    if (req.query.consumerId) filter.consumerId = req.query.consumerId;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;

    // 3. Parallel Execution
    const [payments, total] = await Promise.all([
        Payment.find(filter)
            .populate("consumerId", "name email consumerNumber")
            .populate("billId", "billMonth billYear totalAmount")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Payment.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                payments,
                pagination: {
                    totalItems: total,
                    totalPages,
                    currentPage: page,
                    hasNextPage: page < totalPages
                }
            }, 
            "Payments fetched successfully"
        )
    );
});

/**
 * @desc    Get payments for a specific bill
 * @route   GET /api/v1/payment/bill/:billId
 * @access  Private
 */
export const getPaymentsByBill = asyncHandler(async (req: Request, res: Response) => {
    const { billId } = req.params;

    // 1. Validate the format first
    if (!billId || !mongoose.Types.ObjectId.isValid(billId)) {
        throw new ApiError(400, "Invalid Bill ID format");
    }

    // 2. Cast to ObjectId to solve the "No overload matches" error
    const payments = await Payment.find({ 
        billId: new mongoose.Types.ObjectId(billId) as any
    })
    .populate("consumerId", "name email")
    .sort({ createdAt: -1 })
    .lean();

    return res.status(200).json(
        new ApiResponse(200, payments, "Bill payments fetched successfully")
    );
});

/**
 * @desc    Get payment history for a specific consumer
 * @route   GET /api/v1/payment/consumer/:consumerId
 * @access  Private
 */
interface ConsumerQuery {
    page?: string;
    limit?: string;
}
export const getPaymentHistoryByConsumer = asyncHandler(async (req: Request<any, {}, {}, ConsumerQuery>, res: Response) => {
    const { consumerId } = req.params;
    
    // 1. Pagination Params
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // 2. ID Validation
    if (!mongoose.Types.ObjectId.isValid(consumerId)) {
        throw new ApiError(400, "Invalid Consumer ID");
    }

    // 3. Parallel Execution for Data and Count
    const [payments, total] = await Promise.all([
        Payment.find({ 
            // 'as any' bypasses the strict ObjectId/Uint8Array mismatch error
            consumerId: new mongoose.Types.ObjectId(consumerId) as any 
        })
        .populate("billId", "billMonth billYear totalAmount status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
        Payment.countDocuments({ consumerId: new mongoose.Types.ObjectId(consumerId) as any })
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
        new ApiResponse(200, 
            {
                payments,
                pagination: {
                    totalItems: total,
                    totalPages,
                    currentPage: page,
                }
            }, 
            "Consumer payment history fetched successfully"
        )
    );
});
