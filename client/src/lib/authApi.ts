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
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export const forgotPasswordApi = (data: ForgotPasswordPayload) => {
  return api.post("/auth/forgot-password", data);
};

export const resetPasswordApi = (data: ResetPasswordPayload) => {
  return api.post("/auth/reset-password", data);
};
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePasswordApi = (data: ChangePasswordPayload) => {
  return api.post("/auth/change-password", data);
};

export const deleteAccountApi = () => {
  return api.delete("/auth/delete-account");
};