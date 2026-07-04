import { Notification, NotificationType } from "../models/Notification";

interface CreateNotificationParams {
  recipient: string;
  type: NotificationType;
  message: string;
  relatedRideRequest?: string;
}

export const createNotification = async ({
  recipient,
  type,
  message,
  relatedRideRequest,
}: CreateNotificationParams) => {
  try {
    await Notification.create({ recipient, type, message, relatedRideRequest });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};