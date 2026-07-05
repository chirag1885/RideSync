import { Router } from "express";
import { signup, verifyOtp, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import {  forgotPassword, resetPassword } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;