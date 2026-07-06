import { Request, Response } from "express";
import { Review } from "../models/Review";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { createReviewSchema } from "../utils/validators";

export const createReview = async (req: Request, res: Response) => {
  try {
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { rideRequestId, revieweeId, rating, reviewText, tags } = parsed.data;
    const reviewerId = req.user?.userId;

    if (revieweeId === reviewerId) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    // Confirm a chat actually exists between these two people for this ride —
    // proves they were genuinely matched, not just random users reviewing each other
    const chat = await Chat.findOne({
      rideRequest: rideRequestId,
      participants: { $all: [reviewerId, revieweeId] },
    });

    if (!chat) {
      return res.status(403).json({ message: "You can only review someone you were matched with" });
    }

    const existing = await Review.findOne({
      reviewer: reviewerId,
      reviewee: revieweeId,
      rideRequest: rideRequestId,
    });

    if (existing) {
      return res.status(409).json({ message: "You have already reviewed this person for this ride" });
    }

    const review = await Review.create({
      reviewer: reviewerId,
      reviewee: revieweeId,
      rideRequest: rideRequestId,
      rating,
      reviewText,
      tags,
    });

    // Recalculate the reviewee's average rating and bump their completed trips count
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      rating: Math.round(avgRating * 10) / 10,
      $inc: { completedTrips: 1 },
    });

    return res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getReviewsForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "name profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getReviewableParticipants = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const otherParticipants = chat.participants.filter((p) => p.toString() !== req.user?.userId);
    const alreadyReviewed = await Review.find({
      reviewer: req.user?.userId,
      rideRequest: chat.rideRequest,
      reviewee: { $in: otherParticipants },
    });

    const reviewedIds = alreadyReviewed.map((r) => r.reviewee.toString());
    const pendingReviewIds = otherParticipants
      .map((p) => p.toString())
      .filter((id) => !reviewedIds.includes(id));

    return res.status(200).json({ pendingReviewIds, rideRequestId: chat.rideRequest });
  } catch (error) {
    console.error("Get reviewable participants error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};