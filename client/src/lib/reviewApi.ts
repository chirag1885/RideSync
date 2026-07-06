import api from "./axios";

export interface CreateReviewPayload {
  rideRequestId: string;
  revieweeId: string;
  rating: number;
  reviewText?: string;
  tags?: string[];
}

export const createReviewApi = (data: CreateReviewPayload) => {
  return api.post("/reviews", data);
};

export const getReviewsForUserApi = (userId: string) => {
  return api.get(`/reviews/user/${userId}`);
};

export const getReviewableParticipantsApi = (chatId: string) => {
  return api.get(`/reviews/reviewable/${chatId}`);
};