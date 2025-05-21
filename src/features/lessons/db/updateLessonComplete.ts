import { db } from "@/drizzle/db";
import { UserLessonComplete } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidateUserLessonCompleteCache } from "./cache/userLessonComplete";

export async function updateLessonCompleteStatusDb({
  lessonId,
  userId,
  complete,
}: {
  lessonId: string;
  userId: string;
  complete: boolean;
}) {
  let completion: { lessonId: string; userId: string } | undefined;
  if (complete) {
    const [data] = await db
      .insert(UserLessonComplete)
      .values({
        lessonId,
        userId,
      })
      .onConflictDoNothing()
      .returning();

    completion = data;
  } else {
    const [data] = await db
      .delete(UserLessonComplete)
      .where(
        and(
          eq(UserLessonComplete.lessonId, lessonId),
          eq(UserLessonComplete.userId, userId)
        )
      )
      .returning();

    completion = data;
  }

  if (completion == null) return;

  revalidateUserLessonCompleteCache({
    lessonId: completion.lessonId,
    userId: completion.userId,
  });

  return completion;
}
