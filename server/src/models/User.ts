import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  branch: string;
  year: number;
  gender: "male" | "female" | "other";
  phone: string;
  bio?: string;
  profilePicture?: string;
  isVerified: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  rating: number;
  completedTrips: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@thapar\.edu$/, "Must be a valid Thapar college email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    branch: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
      select: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    completedTrips: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);