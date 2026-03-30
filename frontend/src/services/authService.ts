import api from "@/api/axios";

interface AuthResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    user?: any;
  };
}

export const userRegister = async (payload: any) => {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  return res.data;
};

export const userLogin = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
};

export const userVerifyEmail = async (token: string) => {
  const res = await api.get(`/auth/verify-email/${token}`);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token: string, password: string) => {
  const res = await api.put(`/auth/reset-password/${token}`, { password });
  return res.data;
};
