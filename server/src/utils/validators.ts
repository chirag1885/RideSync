import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").regex(/@thapar\.edu$/, "Must be a Thapar college email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  branch: z.string().min(1, "Branch is required"),
  year: z.number().min(1).max(5),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});
export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  branch: z.string().min(1).optional(),
  year: z.number().min(1).max(5).optional(),
  bio: z.string().max(200).optional(),
  phone: z.string().min(10).optional(),
});
export const createRideRequestSchema = z.object({
  pickup: z.string().min(2, "Pickup location is required"),
  destination: z.string().min(2, "Destination is required"),
  travelDateTime: z.coerce.date().refine((date) => date > new Date(), {
    message: "Travel date/time must be in the future",
  }),
  peopleNeeded: z.number().min(1).max(10),
  genderPreference: z.enum(["anyone", "men", "women"]).default("anyone"),
  notes: z.string().max(300).optional(),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
