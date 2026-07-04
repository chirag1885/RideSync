import api from "./axios";

export interface UpdateProfilePayload {
  name?: string;
  branch?: string;
  year?: number;
  bio?: string;
  phone?: string;
}

export const getProfileApi = () => {
  return api.get("/users/me");
};

export const updateProfileApi = (data: UpdateProfilePayload) => {
  return api.put("/users/me", data);
};