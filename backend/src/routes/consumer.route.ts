import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyAdmin } from "../middlewares/admin.middleware";
import {
    createConsumer,
    getAllConsumers,
    getConsumerById,
    updateConsumer,
    deleteConsumer
} from "../controllers/consumer.controller";

const router = Router();

// All consumer routes should probably be protected and restricted to admin
router.use(verifyJWT);

router.post("/", createConsumer);
router.get("/", getAllConsumers);
router.get("/:id", getConsumerById);
router.put("/:id", updateConsumer);
router.delete("/:id", deleteConsumer);

export default router;
