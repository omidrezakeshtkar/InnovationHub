import { z } from 'zod';

export const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  pointThreshold: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BadgeCreateSchema = BadgeSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Badge = z.infer<typeof BadgeSchema>;
export type BadgeCreate = z.infer<typeof BadgeCreateSchema>;