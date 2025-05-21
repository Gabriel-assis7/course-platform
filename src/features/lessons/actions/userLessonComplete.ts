"use server";

import { getCurrentUser } from "@/services/clerk";
import { canUpdateUserLessonComplete } from "../permissions/userLessonComplete";
import { updateLessonCompleteStatusDb } from "../db/updateLessonComplete";

export async function updateLessonCompleteStatus(
  lessonId: string,
  complete: boolean
) {
  const { userId } = await getCurrentUser();

  const hasPermission = await canUpdateUserLessonComplete({ userId }, lessonId);

  if (userId == null || !hasPermission) {
    return { error: true, message: "Error updating lesson completion status" };
  }

  await updateLessonCompleteStatusDb({ lessonId, userId, complete });

  return {
    error: false,
    message: "Successfully updated lesson completion status",
  };
}
