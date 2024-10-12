import { z } from "zod";

export const BadgeSchema = z.object({
	id: z.string(),
	name: z.string().min(3, "Name is required"),
	description: z.string().min(3, "Description is required"),
	imageUrl: z.string().url("Invalid URL"),
	pointThreshold: z
		.number()
		.int()
		.positive("Point threshold must be a positive integer"),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const BadgeCreateSchema = BadgeSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type Badge = z.infer<typeof BadgeSchema>;
export type BadgeCreate = z.infer<typeof BadgeCreateSchema>;
