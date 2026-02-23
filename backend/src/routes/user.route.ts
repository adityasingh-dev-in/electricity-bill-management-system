import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { deactivateUser, getUser, getUserById, getUsersByFilter, updateUserById } from "../controllers/user.controller";
import { verifyAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.use(verifyJWT)

router.get('/me',getUser)
router.get('/fetch-users',verifyAdmin,getUsersByFilter)
router.get('/fetch/:id',verifyAdmin,getUserById)
router.put('/update/:id',verifyAdmin,updateUserById)
router.delete('/deactivate/:id',verifyAdmin,deactivateUser)

export default router;