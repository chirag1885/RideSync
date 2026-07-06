import { JoinRequest } from "../models/JoinRequest";
import { Request, Response } from "express";
import { RideRequest } from "../models/RideRequest";
import { createRideRequestSchema } from "../utils/validators";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";


export const createRideRequest = async (req: Request, res: Response) => {
  try {
    const parsed = createRideRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const rideRequest = await RideRequest.create({
      ...parsed.data,
      creator: req.user?.userId,
    });

    return res.status(201).json({
      message: "Ride request created successfully",
      rideRequest,
    });
  } catch (error) {
    console.error("Create ride request error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getRideRequests = async (req: Request, res: Response) => {
  try {
    const { pickup, destination, genderPreference, sort } = req.query;

    const filter: Record<string, any> = { status: "open" };

    if (pickup) {
      filter.pickup = { $regex: pickup as string, $options: "i" };
    }
    if (destination) {
      filter.destination = { $regex: destination as string, $options: "i" };
    }
    if (genderPreference && genderPreference !== "anyone") {
      filter.genderPreference = genderPreference;
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

const rideRequests = await RideRequest.find(filter)
  .populate("creator", "name profilePicture branch year rating")
  .sort({ createdAt: sortOrder });

const withSeats = await Promise.all(rideRequests.map(attachSeatsInfo));

return res.status(200).json({ rideRequests: withSeats });
  } catch (error) {
    console.error("Get ride requests error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRideRequestById = async (req: Request, res: Response) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id).populate(
  "creator",
  "name profilePicture branch year rating"
);

if (!rideRequest) {
  return res.status(404).json({ message: "Ride request not found" });
}

const withSeats = await attachSeatsInfo(rideRequest);

return res.status(200).json({ rideRequest: withSeats });
  } catch (error) {
    console.error("Get ride request by id error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
  
};
export const deleteRideRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rideRequest = await RideRequest.findById(id);
    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found" });
    }

    if (rideRequest.creator.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Only the creator can delete this ride request" });
    }

    const chats = await Chat.find({ rideRequest: id });
    const chatIds = chats.map((c) => c._id);

    await Message.deleteMany({ chat: { $in: chatIds } });
    await Chat.deleteMany({ rideRequest: id });
    await JoinRequest.deleteMany({ rideRequest: id });
    await RideRequest.findByIdAndDelete(id);

    return res.status(200).json({ message: "Ride request deleted successfully" });
  } catch (error) {
    console.error("Delete ride request error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const attachSeatsInfo = async (ride: any) => {
  const acceptedCount = await JoinRequest.countDocuments({
    rideRequest: ride._id,
    status: "accepted",
  });
  const seatsRemaining = Math.max(ride.peopleNeeded - acceptedCount, 0);
  return { ...ride.toObject(), acceptedCount, seatsRemaining };
};