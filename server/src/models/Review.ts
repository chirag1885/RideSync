import mongoose, { Document, Schema, Types } from "mongoose";

export type ReviewTag = "friendly" | "on_time" | "safe" | "good_communication" | "would_travel_again";

export interface IReview extends Document {
  reviewer: Types.ObjectId;
  reviewee: Types.ObjectId;
  rideRequest: Types.ObjectId;
  rating: number;
  reviewText?: string;
  tags: ReviewTag[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rideRequest: { type: Schema.Types.ObjectId, ref: "RideRequest", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, maxlength: 300 },
    tags: [
      {
        type: String,
        enum: ["friendly", "on_time", "safe", "good_communication", "would_travel_again"],
      },
    ],
  },
  { timestamps: true }
);

// One review per (reviewer, reviewee, rideRequest) — can't review the same person twice for the same ride
reviewSchema.index({ reviewer: 1, reviewee: 1, rideRequest: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);