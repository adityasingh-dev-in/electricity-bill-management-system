import { Router } from "express";
import {
    getMonthlySummary,
    getTrends,
    getOutstandingBills,
    getConsumerSummary
} from "../controllers/dashboard.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyAdmin } from "../middlewares/admin.middleware";

const router = Router();

// All dashboard routes are protected
router.use(verifyJWT);

// Financial summary for current month
router.get("/monthly-summary", verifyAdmin, getMonthlySummary);

// Collection and billing trends
router.get("/trends", verifyAdmin, getTrends);

// Outstanding bills with aging
router.get("/outstanding", verifyAdmin, getOutstandingBills);

// Consumer-specific 360-degree history
router.get("/consumer-summary/:id", verifyAdmin, getConsumerSummary);

export default router;
