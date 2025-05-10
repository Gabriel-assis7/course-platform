import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getUserLessonCompleteGlobalTag() {
  return getGlobalTag("userLessonComplete");
}

export function getUserLessonCompleteIdTag({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {
  return getIdTag("userLessonComplete", `lesson:${lessonId}-user:${userId}`);
}

export function getUserLessonCompleteUserTag(userId: string) {
  return getUserTag("userLessonComplete", userId);
}

export function revalidateUserLessonCompleteCache({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {
  revalidateTag(getUserLessonCompleteGlobalTag());
  revalidateTag(getUserLessonCompleteIdTag({ userId, lessonId }));
}
