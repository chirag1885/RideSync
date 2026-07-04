import mongoose, { Document, Schema, Types } from "mongoose";

export type NotificationType = "join_request_received" | "join_request_accepted" | "join_request_rejected";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  type: NotificationType;
  message: string;
  relatedRideRequest?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["join_request_received", "join_request_accepted", "join_request_rejected"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedRideRequest: {
      type: Schema.Types.ObjectId,
      ref: "RideRequest",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);