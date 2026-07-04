import { Router } from "express";
import {
  createRideRequest,
  getRideRequests,
  getRideRequestById,
} from "../controllers/rideRequestController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getRideRequests);
router.get("/:id", protect, getRideRequestById);
router.post("/", protect, createRideRequest);

export default router;