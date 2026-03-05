import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Bill from "../models/bill.model";
import Payment from "../models/payment.model";
import Consumer from "../models/consumer.model";
import mongoose from "mongoose";

/**
 * @desc Get current month's financial health summary
 * @route GET /api/v1/dashboard/monthly-summary
 */
export const getMonthlySummary = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    // 1. Total Billed Amount for Current Month
    const billedSummary = await Bill.aggregate([
        {
            $match: {
                billMonth: currentMonth,
                billYear: currentYear
            }
        },
        {
            $group: {
                _id: null,
                totalBilled: { $sum: "$totalAmount" },
                count: { $sum: 1 },
                pendingCount: {
                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                },
                overdueCount: {
                    $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] }
                }
            }
        }
    ]);

    // 2. Total Collected Amount for Current Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const collectedSummary = await Payment.aggregate([
        {
            $match: {
                paymentDate: { $gte: startOfMonth, $lte: endOfMonth },
                status: "completed"
            }
        },
        {
            $group: {
                _id: null,
                totalCollected: { $sum: "$amountPaid" }
            }
        }
    ]);

    // 3. Total Consumers Count
    const totalConsumers = await Consumer.countDocuments();

    const summary = {
        month: currentMonth,
        year: currentYear,
        totalBilled: billedSummary[0]?.totalBilled || 0,
        totalCollected: collectedSummary[0]?.totalCollected || 0,
        billCount: billedSummary[0]?.count || 0,
        pendingBills: billedSummary[0]?.pendingCount || 0,
        overdueBills: billedSummary[0]?.overdueCount || 0,
        totalConsumers
    };

    return res.status(200).json(
        new ApiResponse(200, summary, "Monthly summary fetched successfully")
    );
});

/**
 * @desc Get collection and billing trends for the last 6-12 months
 * @route GET /api/v1/dashboard/trends
 */
export const getTrends = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();
    // Calculate date for 11 months ago to get a total of 12 months including current
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // 1. Aggregate Billed Amounts (Grouping by String Month/Year)
    const billedData = await Bill.aggregate([
        {
            $group: {
                _id: { month: "$billMonth", year: "$billYear" },
                totalBilled: { $sum: "$totalAmount" }
            }
        }
    ]);

    // 2. Aggregate Collected Amounts (Grouping by Date object)
    const collectedData = await Payment.aggregate([
        {
            $match: {
                paymentDate: { $gte: twelveMonthsAgo },
                status: "completed"
            }
        },
        {
            $group: {
                _id: {
                    month: { $dateToString: { format: "%B", date: "$paymentDate" } },
                    year: { $year: "$paymentDate" }
                },
                totalCollected: { $sum: "$amountPaid" }
            }
        }
    ]);

    // 3. Merge the data into a chronological 12-month sequence
    const results = [];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const targetMonth = monthNames[d.getMonth()];
        const targetYear = d.getFullYear();

        // Find billed amount for this specific month/year
        const billedEntry = billedData.find(
            (b) => b._id.month === targetMonth && b._id.year === targetYear
        );

        // Find collected amount for this specific month/year
        const collectedEntry = collectedData.find(
            (c) => c._id.month === targetMonth && c._id.year === targetYear
        );

        results.push({
            label: `${targetMonth.substring(0, 3)} ${targetYear}`, // e.g., "Jan 2024"
            billed: billedEntry?.totalBilled || 0,
            collected: collectedEntry?.totalCollected || 0,
            // Collection Efficiency % (Extra insight for your charts)
            efficiency: billedEntry?.totalBilled 
                ? Math.round((collectedEntry?.totalCollected || 0) / billedEntry.totalBilled * 100) 
                : 0
        });
    }

    return res.status(200).json(
        new ApiResponse(200, results, "12-month trends fetched successfully")
    );
});

/**
 * @desc Get list of outstanding (unpaid) bills with aging
 * @route GET /api/v1/dashboard/outstanding
 */
export const getOutstandingBills = asyncHandler(async (req: Request, res: Response) => {
    const outstandingBills = await Bill.aggregate([
        {
            $match: {
                status: { $in: ["pending", "overdue"] }
            }
        },
        {
            $lookup: {
                from: "consumers",
                localField: "consumerId",
                foreignField: "_id",
                as: "consumer"
            }
        },
        {
            $unwind: "$consumer"
        },
        {
            $project: {
                billMonth: 1,
                billYear: 1,
                totalAmount: 1,
                dueDate: 1,
                status: 1,
                "consumer.name": 1,
                "consumer.meterNumber": 1,
                "consumer.area": 1,
                agingDays: {
                    $floor: {
                        $divide: [
                            { $subtract: [new Date(), "$dueDate"] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            }
        },
        {
            $sort: { agingDays: -1 }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, outstandingBills, "Outstanding bills fetched successfully")
    );
});

/**
 * @desc Get 360-degree view of a specific consumer's history
 * @route GET /api/v1/dashboard/consumer-summary/:id
 */
export const getConsumerSummary = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid consumer ID");
    }

    const consumer = await Consumer.findById(id);
    if (!consumer) {
        throw new ApiError(404, "Consumer not found");
    }

    const consumerObjectId = new mongoose.Types.ObjectId(id);

    const billHistory = await Bill.find({ consumerId: consumerObjectId as any })
        .sort({ createdAt: -1 })
        .limit(10);

    const paymentHistory = await Payment.find({
        consumerId: consumerObjectId as any,
        status: "completed"
    })
        .sort({ paymentDate: -1 })
        .limit(10);

    const totalStats = await Bill.aggregate([
        { $match: { consumerId: consumerObjectId } },
        {
            $group: {
                _id: null,
                totalUnits: { $sum: "$unitsConsumed" },
                totalBilled: { $sum: "$totalAmount" },
                avgMonthlyUnits: { $avg: "$unitsConsumed" }
            }
        }
    ]);

    const summary = {
        consumer,
        recentBills: billHistory,
        recentPayments: paymentHistory,
        stats: totalStats[0] || { totalUnits: 0, totalBilled: 0, avgMonthlyUnits: 0 }
    };

    return res.status(200).json(
        new ApiResponse(200, summary, "Consumer summary fetched successfully")
    );
});
