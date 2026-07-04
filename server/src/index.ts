import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import rideRequestRoutes from "./routes/rideRequestRoutes";
import joinRequestRoutes from "./routes/joinRequestRoutes";
import chatRoutes from "./routes/chatRoutes";
import notificationRoutes from "./routes/notificationRoutes";
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "RideSync API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ride-requests", rideRequestRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});