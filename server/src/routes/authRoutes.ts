import { Router } from "express";
import { signup, verifyOtp, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import {  forgotPassword, resetPassword, changePassword, deleteAccount } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;