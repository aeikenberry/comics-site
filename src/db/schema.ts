import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const comics = pgTable("comics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imagePath: text("image_path").notNull(),
  comicType: text("comic_type").notNull().default("strip"), // 'strip' | 'gag' | 'doodle'
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  comicId: integer("comic_id").notNull().references(() => comics.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Comic = typeof comics.$inferSelect;
export type NewComic = typeof comics.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
