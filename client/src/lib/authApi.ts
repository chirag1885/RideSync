import api from "./axios";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  branch: string;
  year: number;
  gender: "male" | "female" | "other";
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const signupApi = (data: SignupPayload) => {
  return api.post("/auth/signup", data);
};

export const verifyOtpApi = (data: VerifyOtpPayload) => {
  return api.post("/auth/verify-otp", data);
};

export const loginApi = (data: LoginPayload) => {
  return api.post("/auth/login", data);
};

export const getMeApi = () => {
  return api.get("/auth/me");
};