import { Request, Response } from "express";
import { JoinRequest } from "../models/JoinRequest";
import { RideRequest } from "../models/RideRequest";

export const createJoinRequest = async (req: Request, res: Response) => {
  try {
    const { rideRequestId } = req.body;

    if (!rideRequestId) {
      return res.status(400).json({ message: "rideRequestId is required" });
    }

    const rideRequest = await RideRequest.findById(rideRequestId);
    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found" });
    }

    if (rideRequest.status !== "open") {
      return res.status(400).json({ message: "This ride request is no longer open" });
    }

    if (rideRequest.creator.toString() === req.user?.userId) {
      return res.status(400).json({ message: "You cannot join your own ride request" });
    }

    const existing = await JoinRequest.findOne({
      rideRequest: rideRequestId,
      requester: req.user?.userId,
    });

    if (existing) {
      return res.status(409).json({ message: "You have already requested to join this ride" });
    }

    const joinRequest = await JoinRequest.create({
      rideRequest: rideRequestId,
      requester: req.user?.userId,
    });

    return res.status(201).json({ message: "Join request sent", joinRequest });
  } catch (error) {
    console.error("Create join request error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getJoinRequestsForRide = async (req: Request, res: Response) => {
  try {
    const { rideRequestId } = req.params;

    const rideRequest = await RideRequest.findById(rideRequestId);
    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found" });
    }

    if (rideRequest.creator.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Only the creator can view join requests" });
    }

    const joinRequests = await JoinRequest.find({ rideRequest: rideRequestId }).populate(
      "requester",
      "name profilePicture branch year rating"
    );

    return res.status(200).json({ joinRequests });
  } catch (error) {
    console.error("Get join requests error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const respondToJoinRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be 'accept' or 'reject'" });
    }

    const joinRequest = await JoinRequest.findById(id).populate("rideRequest");
    if (!joinRequest) {
      return res.status(404).json({ message: "Join request not found" });
    }

    const rideRequest = joinRequest.rideRequest as any;

    if (rideRequest.creator.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Only the creator can respond to this request" });
    }

    if (joinRequest.status !== "pending") {
      return res.status(400).json({ message: "This request has already been responded to" });
    }

    joinRequest.status = action === "accept" ? "accepted" : "rejected";
    await joinRequest.save();

    return res.status(200).json({ message: `Join request ${joinRequest.status}`, joinRequest });
  } catch (error) {
    console.error("Respond to join request error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyJoinRequests = async (req: Request, res: Response) => {
  try {
    const joinRequests = await JoinRequest.find({ requester: req.user?.userId }).populate({
      path: "rideRequest",
      populate: { path: "creator", select: "name profilePicture branch year rating" },
    });

    return res.status(200).json({ joinRequests });
  } catch (error) {
    console.error("Get my join requests error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};