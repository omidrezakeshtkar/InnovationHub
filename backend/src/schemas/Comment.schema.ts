import { z } from "zod";
import { objectIdSchema } from "./index";

export const CommentSchema = z.object({
	_id: objectIdSchema,
	content: z.string().min(3, "Content is required"),
	author: objectIdSchema, // Assuming this is the ObjectId
	idea: objectIdSchema, // Assuming this is the ObjectId
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CommentCreateSchema = z.object({
	body: CommentSchema.omit({
		_id: true,
		author: true,
		idea: true,
		createdAt: true,
		updatedAt: true,
	}),
});

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;
