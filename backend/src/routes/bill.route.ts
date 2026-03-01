import { Router } from "express";
import {
    getAllBills,
    getBillById,
    getConsumerBillHistory,
    updateBillStatus,
    deleteBill,
    getBillPDF,
    getMyBills
} from "../controllers/bill.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// All routes are protected by JWT (Staff/Admin only)
router.use(verifyJWT);

router.get("/", getAllBills);
router.get("/my-bills", getMyBills);
router.get("/:id", getBillById);
router.get("/:id/pdf", getBillPDF);
router.get("/consumer/:consumerId", getConsumerBillHistory);
router.patch("/:id/status", updateBillStatus);
router.delete("/:id", deleteBill);

export default router;
