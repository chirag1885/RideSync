import { Request, Response } from "express";
import { Notification } from "../models/Notification";

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ recipient: req.user?.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user?.userId,
      isRead: false,
    });

    return res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user?.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany(
      { recipient: req.user?.userId, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all read error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};