import api from "./axios";

export const getMyNotificationsApi = () => {
  return api.get("/notifications");
};

export const markNotificationReadApi = (id: string) => {
  return api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsReadApi = () => {
  return api.patch("/notifications/mark-all-read");
};