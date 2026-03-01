import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Bill from "../models/bill.model";
import MeterReading from "../models/meterReading.model";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

/**
 * @desc    Get All Bills (with filters)
 * @route   GET /api/v1/bill
 * @access  Private (Staff/Admin)
 */
export const getAllBills = asyncHandler(async (req: Request, res: Response) => {
    const { month, year, status, limit = 10, page = 1 } = req.query;

    const query: any = {};
    if (month) query.billMonth = month;
    if (year) query.billYear = Number(year);
    if (status) query.status = status;

    const bills = await Bill.find(query)
        .populate("consumerId", "name meterNumber area")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

    const totalBills = await Bill.countDocuments(query);
    return res.status(200).json(
        new ApiResponse(200, {
            bills,
            pagination: {
                total: totalBills,
                page: Number(page),
                pages: Math.ceil(totalBills / Number(limit))
            }
        }, "Bills fetched successfully")
    );
});

/**
 * @desc    Get Single Bill Details
 * @route   GET /api/v1/bill/:id
 * @access  Private (Staff/Admin)
 */
export const getBillById = asyncHandler(async (req: Request, res: Response) => {
    const bill = await Bill.findById(req.params.id)
        .populate("consumerId")
        .populate("meterReadingId")
        .populate("generatedBy", "name");

    if (!bill) {
        throw new ApiError(404, "Bill not found");
    }

    return res.status(200).json(
        new ApiResponse(200, bill, "Bill fetched successfully")
    );
});

/**
 * @desc    Get Bill History for a specific Consumer
 * @route   GET /api/v1/bill/consumer/:consumerId
 * @access  Private (Staff/Admin)
 */
export const getConsumerBillHistory = asyncHandler(async (req: Request, res: Response) => {
    const { consumerId } = req.params;

    const bills = await Bill.find({ consumerId } as any)
        .sort({ billYear: -1, createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, bills, "Consumer bill history fetched")
    );
});

/**
 * @desc    Update Bill Status (Manual Pay/Overdue)
 * @route   PATCH /api/v1/bill/:id/status
 * @access  Private (Staff/Admin)
 */
export const updateBillStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!['pending', 'paid', 'overdue'].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be pending, paid, or overdue.");
    }

    const bill = await Bill.findByIdAndUpdate(
        req.params.id,
        { $set: { status, paidAt: status === 'paid' ? new Date() : null } },
        { new: true }
    );

    if (!bill) {
        throw new ApiError(404, "Bill not found");
    }

    return res.status(200).json(
        new ApiResponse(200, bill, `Bill status updated to ${status}`)
    );
});

/**
 * @desc    Delete Bill (Only if status is pending)
 * @route   DELETE /api/v1/bill/:id
 * @access  Private (Staff/Admin)
 */
export const deleteBill = asyncHandler(async (req: Request, res: Response) => {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        throw new ApiError(404, "Bill not found");
    }

    if (bill.status !== 'pending') {
        throw new ApiError(400, `Cannot delete bill as it is already ${bill.status}`);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Delete the bill
        await Bill.findByIdAndDelete(req.params.id).session(session);

        // ALSO delete the associated reading so the staff can re-enter it if needed
        if (bill.meterReadingId) {
            await MeterReading.findByIdAndDelete(bill.meterReadingId).session(session);
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(
            new ApiResponse(200, {}, "Bill and associated reading deleted successfully")
        );
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(500, error.message || "Failed to delete bill");
    }
});


/**
 * @desc    Generate PDF for a Bill
 * @route   GET /api/v1/bill/:id/pdf
 * @access  Private
 */
export const getBillPDF = asyncHandler(async (req: Request, res: Response) => {
    const bill = await Bill.findById(req.params.id)
        .populate("consumerId")
        .populate("meterReadingId");

    if (!bill) {
        throw new ApiError(404, "Bill not found");
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `Bill_${bill._id}.pdf`;

    // Set headers for PDF download/view
    res.setHeader("Content-disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    // Helper for table-like rows
    const generateTableRow = (doc: any, y: number, item: string, description: string, amount: string) => {
        doc.fontSize(10)
            .text(item, 50, y)
            .text(description, 150, y)
            .text(amount, 90, y, { align: 'right' });
    };

    const generateHr = (doc: any, y: number) => {
        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    };

    // --- Header ---
    doc.fillColor("#444444")
        .fontSize(20)
        .text("ELECTRICITY BOARD", 50, 57)
        .fontSize(10)
        .text("123 Utility Street, Power City", 50, 80)
        .text("Phone: +1-555-0123 | Email: support@eb.gov", 50, 95)
        .fontSize(25)
        .fillColor("#2c3e50")
        .text("INVOICE", 50, 57, { align: "right" })
        .fontSize(10)
        .fillColor("#444444")
        .text(`Bill ID: ${bill._id}`, 50, 85, { align: "right" })
        .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 100, { align: "right" });

    doc.moveDown();
    generateHr(doc, 120);

    // --- Consumer & Bill Summary ---
    doc.font('Helvetica-Bold')
        .fontSize(14)
        .fillColor("#2c3e50")
        .text("Bill To:", 50, 140)
        .font('Helvetica')
        .fontSize(10)
        .fillColor("#000")
        .text(`Name: ${(bill.consumerId as any).name}`, 50, 160)
        .text(`Meter Number: ${(bill.consumerId as any).meterNumber}`, 50, 175)
        .text(`Address: ${(bill.consumerId as any).area}, ${(bill.consumerId as any).city}`, 50, 190)
        .text(`Contact: ${(bill.consumerId as any).phone}`, 50, 205);

    doc.font('Helvetica-Bold')
        .fontSize(14)
        .fillColor("#2c3e50")
        .text("Bill Details:", 350, 140)
        .font('Helvetica')
        .fontSize(10)
        .fillColor("#000")
        .text(`Billing Month: ${bill.billMonth} ${bill.billYear}`, 350, 160);

    doc.fillColor(bill.status === 'paid' ? 'green' : 'red')
        .text(`Status: ${bill.status.toUpperCase()}`, 350, 175);

    doc.fillColor("#000")
        .text(`Due Date: ${bill.dueDate.toDateString()}`, 350, 190)
        .text(`Paid At: ${bill.paidAt ? bill.paidAt.toDateString() : 'N/A'}`, 350, 205);

    generateHr(doc, 230);

    // --- Reading Details ---
    const reading = bill.meterReadingId as any;
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor("#2c3e50")
        .text("Reading Summary", 50, 250);

    const readingY = 270;
    doc.font('Helvetica')
        .fontSize(10)
        .fillColor("#000")
        .text(`Previous Reading: ${reading ? reading.previousReading : 'N/A'}`, 50, readingY)
        .text(`Current Reading: ${reading ? reading.currentReading : 'N/A'}`, 200, readingY)
        .text(`Units Consumed: ${bill.unitsConsumed} kWh`, 350, readingY);

    generateHr(doc, 290);

    // --- Charges Table ---
    const tableTop = 320;
    doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor("#2c3e50")
        .text("Description", 50, tableTop)
        .text("Amount", 450, tableTop, { align: "right" });

    generateHr(doc, tableTop + 15);

    const items = [
        { label: "Energy Charge", value: `$${bill.energyCharge.toFixed(2)}` },
        { label: "Fixed Connection Charge", value: `$${bill.fixedCharge.toFixed(2)}` }
    ];

    let currentY = tableTop + 30;
    doc.font('Helvetica');
    items.forEach(item => {
        doc.fillColor("#000")
            .text(item.label, 50, currentY)
            .text(item.value, 450, currentY, { align: "right" });
        currentY += 20;
    });

    generateHr(doc, currentY + 10);

    // --- Totals ---
    doc.font('Helvetica-Bold')
        .fontSize(16)
        .fillColor("#2c3e50")
        .text("TOTAL AMOUNT:", 50, currentY + 30)
        .text(`$${bill.totalAmount.toFixed(2)}`, 450, currentY + 30, { align: "right" });

    // --- Status Stamp ---
    doc.save();
    doc.rotate(-45, { origin: [300, 500] });
    if (bill.status === 'paid') {
        doc.fontSize(60)
            .fillColor("green")
            .opacity(0.2)
            .text("PAID", 200, 500);
    } else {
        doc.fontSize(60)
            .fillColor("red")
            .opacity(0.2)
            .text("UNPAID", 200, 500);
    }
    doc.restore();

    // --- Footer ---
    const footerY = 750;
    generateHr(doc, footerY);
    doc.fontSize(8)
        .fillColor("#777777")
        .text("Please pay by the due date to avoid late fees. Keep this receipt for future reference.", 50, footerY + 10, { align: "center" })
        .text("Powered by Electricity Bill Management System", 50, footerY + 25, { align: "center" });

    doc.end();
    doc.pipe(res);
});

/**
 * @desc    Get Bills generated by the current user
 * @route   GET /api/v1/bill/my-bills
 * @access  Private (Staff/Admin)
 */
export const getMyBills = asyncHandler(async (req: any, res: Response) => {
    const { month, year, status, limit = 10, page = 1 } = req.query;

    const query: any = { generatedBy: req.user?._id };
    if (month) query.billMonth = month;
    if (year) query.billYear = Number(year);
    if (status) query.status = status;

    const bills = await Bill.find(query)
        .populate("consumerId", "name meterNumber area")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

    const totalBills = await Bill.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            bills,
            pagination: {
                total: totalBills,
                page: Number(page),
                pages: Math.ceil(totalBills / Number(limit))
            }
        }, "Your bills fetched successfully")
    );
});
