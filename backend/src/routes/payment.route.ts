import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    getAllPayments,
    getPaymentHistoryByConsumer,
    getPaymentsByBill,
    recordPayment
} from "../controllers/payment.controller";

const router = Router();

// Secure all routes
router.use(verifyJWT);

router.route("/").post(recordPayment).get(getAllPayments);
router.get("/bill/:billId",getPaymentsByBill);
router.get("/consumer/:consumerId",getPaymentHistoryByConsumer);

export default router;