import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, markNotificationRead);
router.patch("/mark-all-read", protect, markAllNotificationsRead);

export default router;