import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRideRequest extends Document {
  creator: Types.ObjectId;
  pickup: string;
  destination: string;
  travelDateTime: Date;
  peopleNeeded: number;
  genderPreference: "anyone" | "men" | "women";
  notes?: string;
  status: "open" | "closed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const rideRequestSchema = new Schema<IRideRequest>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickup: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    travelDateTime: {
      type: Date,
      required: true,
    },
    peopleNeeded: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    genderPreference: {
      type: String,
      enum: ["anyone", "men", "women"],
      default: "anyone",
    },
    notes: {
      type: String,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const RideRequest = mongoose.model<IRideRequest>("RideRequest", rideRequestSchema);