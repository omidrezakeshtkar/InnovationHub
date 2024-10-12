import { z } from "zod";
import mongoose from "mongoose";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { objectIdSchema } from "./index";

extendZodWithOpenApi(z);

// Schema for a single idea
export const IdeaSchema = z
	.object({
		_id: objectIdSchema.openapi({ example: "60d5ec49f1b2c72b9c8e4d3b" }),
		title: z
			.string()
			.min(3, "Title is required")
			.openapi({ example: "New Idea" }),
		description: z
			.string()
			.min(3, "Description is required")
			.openapi({ example: "This is a new idea" }),
		author: objectIdSchema.openapi({ example: "60d5ec49f1b2c72b9c8e4d3b" }),
		coAuthors: z
			.array(objectIdSchema)
			.optional()
			.openapi({
				example: ["60d5ec49f1b2c72b9c8e4d3c", "60d5ec49f1b2c72b9c8e4d3d"],
			}),
		status: z
			.enum([
				"pending_approval",
				"submitted",
				"in_review",
				"approved",
				"implemented",
				"rejected",
			])
			.openapi({ example: "pending_approval" }),
		categoryId: objectIdSchema.openapi({ example: "60d5ec49f1b2c72b9c8e4d3b" }),
		department: z.string().openapi({ example: "Engineering" }),
		votes: z.number().openapi({ example: 10 }),
		tags: z
			.array(z.string())
			.optional()
			.openapi({ example: ["innovation", "tech"] }),
		currentVersion: z.number().openapi({ example: 1 }),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
	.openapi("Idea");

// Schema for creating an idea
export const IdeaCreateSchema = z
	.object({
		body: IdeaSchema.omit({
			_id: true,
			author: true,
			status: true,
			votes: true,
			currentVersion: true,
			createdAt: true,
			updatedAt: true,
			department: true,
			categoryId: true,
		}),
	})
	.openapi("IdeaCreate");

// Schema for updating an idea
export const IdeaUpdateSchema = z
	.object({
		body: IdeaSchema.omit({
			_id: true,
			author: true,
			status: true,
			votes: true,
			currentVersion: true,
			createdAt: true,
			updatedAt: true,
			department: true,
		}).partial(),
	})
	.openapi("IdeaUpdate");

// Schema for voting on an idea
export const VoteSchema = z
	.object({
		body: z.object({
			vote: z.enum(["up", "down"]).openapi({ example: "up" }),
		}),
	})
	.openapi("Vote");

// Error schema
export const ErrorSchema = z.object({
	message: z.string(),
});

// Schema for getting ideas response
export const GetIdeasResponse = z.array(IdeaSchema).openapi("GetIdeasResponse");

export type Idea = z.infer<typeof IdeaSchema>;
export type IdeaCreate = z.infer<typeof IdeaCreateSchema>;
export type IdeaUpdate = z.infer<typeof IdeaUpdateSchema>;
export type Vote = z.infer<typeof VoteSchema>;
