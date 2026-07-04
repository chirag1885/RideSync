import { Request, Response } from "express";
import { RideRequest } from "../models/RideRequest";
import { createRideRequestSchema } from "../utils/validators";

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

    return res.status(200).json({ rideRequests });
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

    return res.status(200).json({ rideRequest });
  } catch (error) {
    console.error("Get ride request by id error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};