import api from "@/api/axios";

export const getLessons = async () => {
  const res = await api.get("/lessons");
  return res.data;
};

export const getLesson = async (id: string) => {
  const res = await api.get(`/lessons/${id}`);
  return res.data;
};

export const submitLesson = async (lessonId: string, xpReward: number) => {
  const res = await api.post("/lessons/submit", { lessonId, xpReward });
  return res.data;
};
