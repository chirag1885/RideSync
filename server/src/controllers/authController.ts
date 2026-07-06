import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { signupSchema, verifyOtpSchema, loginSchema } from "../utils/validators";
import { generateOTP, getOTPExpiry } from "../utils/otp";
import { generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/sendEmail";
import { otpEmailTemplate } from "../utils/emailTemplates";
import { forgotPasswordSchema, resetPasswordSchema } from "../utils/validators";
import { changePasswordSchema } from "../utils/validators";
import { RideRequest } from "../models/RideRequest";
import { JoinRequest } from "../models/JoinRequest";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { Review } from "../models/Review";
import { Notification } from "../models/Notification";
export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, email, password, branch, year, gender, phone } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiresAt = getOTPExpiry();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      branch,
      year,
      gender,
      phone,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    await sendEmail({
  to: email,
  subject: "Verify your RideSync account",
  html: otpEmailTemplate(otp, "verify"),
});

    return res.status(201).json({
      message: "Signup successful. Please verify your email with the OTP sent.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong during signup" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, otp } = parsed.data;

    const user = await User.findOne({ email }).select("+otp +otpExpiresAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP found, please request a new one" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Something went wrong during verification" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong during login" });
  }
};
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email } = parsed.data;

    const user = await User.findOne({ email });
    // Always respond the same way whether or not the user exists — avoids leaking which emails are registered
    if (!user) {
      return res.status(200).json({
        message: "If that email is registered, a reset code has been sent.",
      });
    }

    const otp = generateOTP();
    const otpExpiresAt = getOTPExpiry();

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Reset your RideSync password",
      html: otpEmailTemplate(otp, "reset"),
    });

    return res.status(200).json({
      message: "If that email is registered, a reset code has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, otp, newPassword } = parsed.data;

    const user = await User.findOne({ email }).select("+otp +otpExpiresAt +password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No reset code found, please request a new one" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const changePassword = async (req: Request, res: Response) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await User.findById(req.user?.userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Clean up everything tied to this user across collections
    const myRideRequests = await RideRequest.find({ creator: userId });
    const rideRequestIds = myRideRequests.map((r) => r._id);

    const myChats = await Chat.find({ participants: userId });
    const chatIds = myChats.map((c) => c._id);

    await Message.deleteMany({ chat: { $in: chatIds } });
    await Chat.deleteMany({ participants: userId });
    await JoinRequest.deleteMany({ $or: [{ requester: userId }, { rideRequest: { $in: rideRequestIds } }] });
    await Review.deleteMany({ $or: [{ reviewer: userId }, { reviewee: userId }] });
    await Notification.deleteMany({ recipient: userId });
    await RideRequest.deleteMany({ creator: userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};