import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { UserLessonComplete } from "@/drizzle/schema";
import { LessonStatus, LessonTable } from "@/drizzle/schema/lesson";
import { YoutubeVideoPlayer } from "@/features/lessons/components/YoutubeVideoPlay";
import { getLessonIdTag } from "@/features/lessons/db/cache/lessons";
import { getUserLessonCompleteIdTag } from "@/features/lessons/db/cache/userLessonComplete";
import {
  canViewLesson,
  wherePublicLessons,
} from "@/features/lessons/permissions/lessons";
import { canUpdateUserLessonComplete } from "@/features/lessons/permissions/userLessonComplete";
import { getCurrentUser } from "@/services/clerk";
import { and, eq } from "drizzle-orm";
import { CheckSquare2Icon, LockIcon, XSquareIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const lesson = await getLesson(lessonId);

  if (lesson == null) return notFound();
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SuspenseBoundary lesson={lesson} courseId={courseId} />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return null;
}

async function SuspenseBoundary({
  lesson,
  courseId,
}: {
  lesson: {
    id: string;
    name: string;
    description: string | null;
    youtubeVideoId: string;
    sectionId: string;
    status: LessonStatus;
  };
  courseId: string;
}) {
  const { userId, role } = await getCurrentUser();
  const isLessonComplete =
    userId == null
      ? false
      : await getIsLessonComplete({ lessonId: lesson.id, userId });
  const canView = await canViewLesson({ role, userId }, lesson);
  const canUpdateCompleteStatus = await canUpdateUserLessonComplete(
    { userId },
    lesson.id
  );

  return (
    <div className="my-4 flex flex-col gap-4">
      <div className="aspect-video">
        {canView ? (
          <YoutubeVideoPlayer
            videoId={lesson.youtubeVideoId}
            onFinishedVideo={
              !isLessonComplete && canUpdateCompleteStatus
                ? updateLessonCompleteStatus.bind(null, lesson.id, true)
                : undefined
            }
          />
        ) : (
          <div className="flex items-center justify-center bg-primary text-primary-foreground h-full w-full">
            <LockIcon className="size-16" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-semibold">{lesson.name}</h1>
          <div className="flex gap-2 justify-end">
            <Button asChild variant="outline">
              <Link href="">Previous</Link>
            </Button>
            <ActionButton action={null} variant="outline">
              <div className="flex gap-2 items-center">
                {isLessonComplete ? (
                  <>
                    <CheckSquare2Icon /> Mark Incomplete
                  </>
                ) : (
                  <>
                    <XSquareIcon /> Mark Complete
                  </>
                )}
              </div>
            </ActionButton>
            <Button asChild variant="outline">
              <Link href="">Next</Link>
            </Button>
          </div>
        </div>
        {canView ? (
          lesson.description && <p>{lesson.description}</p>
        ) : (
          <p>This lesson is locked. Please purchase the course to view it.</p>
        )}
      </div>
    </div>
  );
}

async function getLesson(id: string) {
  "use cache";
  cacheTag(getLessonIdTag(id));

  return db.query.LessonTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      youtubeVideoId: true,
      sectionId: true,
      status: true,
    },
    where: and(eq(LessonTable.id, id), wherePublicLessons),
  });
}

async function getIsLessonComplete({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {
  "use cache";
  cacheTag(getUserLessonCompleteIdTag({ userId, lessonId }));

  const data = await db.query.UserLessonComplete.findFirst({
    where: and(
      eq(UserLessonComplete.userId, userId),
      eq(UserLessonComplete.lessonId, lessonId)
    ),
  });

  return data != null;
}
