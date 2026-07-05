import mongoose, { Document, Schema, Types } from "mongoose";

export interface IJoinRequest extends Document {
  rideRequest: Types.ObjectId;
  requester: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  message?: string;
}

const joinRequestSchema = new Schema<IJoinRequest>(
  {
    rideRequest: {
      type: Schema.Types.ObjectId,
      ref: "RideRequest",
      required: true,
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
    type: String,
    maxlength: 300,
    },
  },
  { timestamps: true }
);

// Prevent the same user from sending multiple join requests to the same ride request
joinRequestSchema.index({ rideRequest: 1, requester: 1 }, { unique: true });

export const JoinRequest = mongoose.model<IJoinRequest>("JoinRequest", joinRequestSchema);