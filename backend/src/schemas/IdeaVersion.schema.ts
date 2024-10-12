import { z } from "zod";
import { objectIdSchema } from "./index";

export const IdeaVersionSchema = z.object({
	id: objectIdSchema,
	idea: objectIdSchema, // Assuming this is the ObjectId
	title: z.string().min(3, "Title is required"),
	description: z.string().min(3, "Description is required"),
	updatedBy: objectIdSchema, // Assuming this is the ObjectId
	versionNumber: z
		.number()
		.int()
		.positive("Version number must be a positive integer"),
	createdAt: z.date(),
});

export const IdeaVersionCreateSchema = IdeaVersionSchema.omit({
	id: true,
	createdAt: true,
});

export type IdeaVersion = z.infer<typeof IdeaVersionSchema>;
export type IdeaVersionCreate = z.infer<typeof IdeaVersionCreateSchema>;
