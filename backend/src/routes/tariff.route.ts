import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { activateTariff, createTariff, getActiveTariff, getTariffHistory, updateTariff } from "../controllers/tariff.controller";
import { verifyAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.use(verifyJWT)

//public routes
router.get('/',getActiveTariff)

//admin routes
router.post('/',verifyAdmin,createTariff);
router.get('/history',verifyAdmin,getTariffHistory)
router.put('/:id',verifyAdmin,updateTariff)
router.patch('/:id/activate',verifyAdmin,activateTariff)

export default router;