import { z } from 'zod';

export const IdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author: z.string(), // Assuming this is the ObjectId as a string
  coAuthors: z.array(z.string()), // Array of ObjectIds as strings
  status: z.enum(['draft', 'submitted', 'in_review', 'approved', 'implemented', 'rejected']),
  category: z.string(), // Assuming this is the ObjectId as a string
  department: z.string(),
  votes: z.number(),
  tags: z.array(z.string()),
  currentVersion: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const IdeaCreateSchema = IdeaSchema.omit({ 
  id: true, 
  coAuthors: true, 
  status: true, 
  votes: true, 
  currentVersion: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  coAuthors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type Idea = z.infer<typeof IdeaSchema>;
export type IdeaCreate = z.infer<typeof IdeaCreateSchema>;