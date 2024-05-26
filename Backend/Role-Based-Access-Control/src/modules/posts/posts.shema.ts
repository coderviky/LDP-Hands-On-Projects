// POSTS Schemas
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';



// create post schema
/*
export const postTable = pgTable("post", {
    id: serial("postId").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    userId: integer("userId").references(() => userTable.id),
},
*/
export const createPostSchema = z.object({
    title: z.string().min(1).max(256),
    content: z.string().min(1),
    userId: z.number()
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;

export const createPostJsonSchema = {
    body: zodToJsonSchema(createPostSchema, "createPostSchema")
};