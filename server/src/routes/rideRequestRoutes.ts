import { Router } from "express";
import {
  createRideRequest,
  getRideRequests,
  getRideRequestById,
  deleteRideRequest,
} from "../controllers/rideRequestController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getRideRequests);
router.get("/:id", protect, getRideRequestById);
router.post("/", protect, createRideRequest);
router.delete("/:id", protect, deleteRideRequest);

export default router;