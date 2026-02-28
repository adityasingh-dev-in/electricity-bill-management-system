import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createTariff } from "../controllers/tariff.controller";
import { verifyAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.use(verifyJWT)

router.post('/',verifyAdmin,createTariff);

export default router;