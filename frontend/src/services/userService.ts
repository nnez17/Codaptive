import api from "@/api/axios";

export const getUserProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

export const updateProfile = async (data: {
  username?: string;
  email?: string;
  avatar?: string;
  theme?: "light" | "dark";
  notifications?: boolean;
}) => {
  const res = await api.put("/user/update", data);
  return res.data;
};

export const completeLesson = async (
  lessonId: string,
  xpGained: number,
  allCorrect: boolean,
) => {
  const res = await api.post("/user/complete-lesson", {
    lessonId,
    xpGained,
    allCorrect,
  });
  return res.data;
};

export const completeChallenge = async () => {
  const res = await api.post("/user/complete-challenge");
  return res.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const res = await api.put("/user/password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};

export const uploadAvatar = async (base64: string) => {
  const res = await api.put("/user/update", { avatar: base64 });
  return res.data;
};
