import { Router } from "express";
import { signup, verifyOtp, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;