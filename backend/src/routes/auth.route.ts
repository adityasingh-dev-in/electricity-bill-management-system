import { Router } from "express";
import { login, logout, register, sendEmailVerification, verifyOtp, resetPassword } from "../controllers/auth.controller";
import { refreshAccessToken } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { otpRequestLimiter, otpVerifyLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router()

router.post("/register", register);
router.post("/login", login)
router.get('/logout', verifyJWT, logout)
router.post("/send-otp", otpRequestLimiter, sendEmailVerification)
router.post("/verify-otp", otpVerifyLimiter, verifyOtp)
router.post("/reset-password", resetPassword)
router.post("/refresh-token", refreshAccessToken)

export default router;