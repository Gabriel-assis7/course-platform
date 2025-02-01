import { pgTable, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { LessonTable } from "./lesson";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const UserLessonComplete = pgTable("user_lesson_complete", {
    userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: 'cascade' }),
    lessonId: uuid()
    .notNull()
    .references(() => LessonTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt
})

export const userLessonCompleteRelationships = relations(
    UserLessonComplete,
    ({ one }) => ({
        user: one(UserTable, {
            fields: [UserLessonComplete.userId],
            references: [UserTable.id],
        }),
        lesson: one(LessonTable, {
            fields: [UserLessonComplete.lessonId],
            references: [LessonTable.id]
        }),
    })
)