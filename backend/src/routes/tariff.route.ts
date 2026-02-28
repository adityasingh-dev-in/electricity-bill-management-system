import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createTariff, getActiveTariff } from "../controllers/tariff.controller";
import { verifyAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.use(verifyJWT)

router.post('/',verifyAdmin,createTariff);
router.get('/',getActiveTariff)

export default router;