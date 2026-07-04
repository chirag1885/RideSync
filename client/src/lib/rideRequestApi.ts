import api from "./axios";

export interface CreateRideRequestPayload {
  pickup: string;
  destination: string;
  travelDateTime: string;
  peopleNeeded: number;
  genderPreference: "anyone" | "men" | "women";
  notes?: string;
}

export interface RideRequestFilters {
  pickup?: string;
  destination?: string;
  genderPreference?: string;
  sort?: "newest" | "oldest";
}

export const createRideRequestApi = (data: CreateRideRequestPayload) => {
  return api.post("/ride-requests", data);
};

export const getRideRequestsApi = (filters?: RideRequestFilters) => {
  return api.get("/ride-requests", { params: filters });
};

export const getRideRequestByIdApi = (id: string) => {
  return api.get(`/ride-requests/${id}`);
};