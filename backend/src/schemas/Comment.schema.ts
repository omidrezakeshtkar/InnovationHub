import { z } from "zod";
import { objectIdSchema } from "./index";

export const CommentSchema = z.object({
	id: objectIdSchema,
	content: z.string().min(3, "Content is required"),
	author: objectIdSchema, // Assuming this is the ObjectId
	idea: objectIdSchema, // Assuming this is the ObjectId
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CommentCreateSchema = CommentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;
