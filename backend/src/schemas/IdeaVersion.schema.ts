import { z } from 'zod';

export const IdeaVersionSchema = z.object({
  id: z.string(),
  idea: z.string(), // Assuming this is the ObjectId as a string
  title: z.string(),
  description: z.string(),
  updatedBy: z.string(), // Assuming this is the ObjectId as a string
  versionNumber: z.number(),
  createdAt: z.date(),
});

export const IdeaVersionCreateSchema = IdeaVersionSchema.omit({ id: true, createdAt: true });

export type IdeaVersion = z.infer<typeof IdeaVersionSchema>;
export type IdeaVersionCreate = z.infer<typeof IdeaVersionCreateSchema>;