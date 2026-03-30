import api from "@/api/axios";

export const getUserProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};
