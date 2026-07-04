import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChat extends Document {
  rideRequest: Types.ObjectId;
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    rideRequest: {
      type: Schema.Types.ObjectId,
      ref: "RideRequest",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);