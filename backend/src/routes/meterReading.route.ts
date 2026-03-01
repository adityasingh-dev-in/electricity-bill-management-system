import { Router } from "express";
import {
    createMeterReading,
    getAllMeterReadings,
    getConsumerDetailsByMeter,
    getMeterReadingById,
    deleteMeterReading
} from "../controllers/meterReading.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// All routes are protected by JWT (Staff/Admin only)
router.use(verifyJWT);

router.route("/")
    .post(createMeterReading)
    .get(getAllMeterReadings);

router.get("/consumer/:meterNumber", getConsumerDetailsByMeter);

router.route("/:id")
    .get(getMeterReadingById)
    .delete(deleteMeterReading);

export default router;
