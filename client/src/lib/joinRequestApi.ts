import api from "./axios";

export const createJoinRequestApi = (rideRequestId: string) => {
  return api.post("/join-requests", { rideRequestId });
};

export const getJoinRequestsForRideApi = (rideRequestId: string) => {
  return api.get(`/join-requests/ride/${rideRequestId}`);
};

export const respondToJoinRequestApi = (id: string, action: "accept" | "reject") => {
  return api.patch(`/join-requests/${id}/respond`, { action });
};

export const getMyJoinRequestsApi = () => {
  return api.get("/join-requests/my-requests");
};