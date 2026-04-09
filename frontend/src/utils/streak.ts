export const calculateStreak = (lessons: any[]): number => {
  if (!lessons || lessons.length === 0) return 0;

  const completedDates = Array.from(
    new Set(
      lessons
        .filter((l) => l.completed && l.completedAt)
        .map((l) => new Date(l.completedAt).toISOString().split("T")[0]),
    ),
  ).sort((a: any, b: any) => b.localeCompare(a));

  if (completedDates.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  const newestDate = completedDates[0];

  if (newestDate !== today && newestDate !== yesterday) {
    return 0;
  }
  let streak = 0;
  let currentDate = new Date(newestDate);

  for (let i = 0; i < completedDates.length; i++) {
    const dateStr = completedDates[i];
    const expectedDateStr = currentDate.toISOString().split("T")[0];

    if (dateStr === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
