import { Router } from "express";
import {
  createJoinRequest,
  getJoinRequestsForRide,
  respondToJoinRequest,
  getMyJoinRequests,
  removeAcceptedParticipant,
} from "../controllers/joinRequestController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createJoinRequest);
router.get("/my-requests", protect, getMyJoinRequests);
router.get("/ride/:rideRequestId", protect, getJoinRequestsForRide);
router.patch("/:id/respond", protect, respondToJoinRequest);
router.delete("/:id/remove", protect, removeAcceptedParticipant);

export default router;