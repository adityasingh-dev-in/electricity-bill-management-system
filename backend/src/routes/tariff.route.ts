import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createTariff, getActiveTariff, getTariffHistory } from "../controllers/tariff.controller";
import { verifyAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.use(verifyJWT)

//public routes
router.get('/',getActiveTariff)

//admin routes
router.post('/',verifyAdmin,createTariff);
router.get('/history',verifyAdmin,getTariffHistory)

export default router;