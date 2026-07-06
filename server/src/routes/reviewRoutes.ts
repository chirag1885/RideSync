import { Router } from "express";
import { createReview, getReviewsForUser, getReviewableParticipants } from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createReview);
router.get("/user/:userId", protect, getReviewsForUser);
router.get("/reviewable/:chatId", protect, getReviewableParticipants);

export default router;