import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.string(), // Assuming this is the ObjectId as a string
  idea: z.string(), // Assuming this is the ObjectId as a string
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CommentCreateSchema = CommentSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;