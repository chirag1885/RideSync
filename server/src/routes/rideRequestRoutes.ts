import { Router } from "express";
import { createRideRequest } from "../controllers/rideRequestController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createRideRequest);

export default router;