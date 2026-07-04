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