import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { objectIdSchema } from "./index";

extendZodWithOpenApi(z);

// Schema for a single category
export const CategorySchema = z
	.object({
		id: objectIdSchema.openapi({ example: "60d5ec49f1b2c72b9c8e4d3b" }),
		name: z
			.string()
			.min(3, "Name is required")
			.openapi({ example: "Technology" }),
		description: z
			.string()
			.openapi({ example: "Category for technology-related ideas" }),
		createdAt: z.date().openapi({ example: "2023-01-01T00:00:00Z" }),
		updatedAt: z.date().openapi({ example: "2023-01-02T00:00:00Z" }),
	})
	.openapi("Category");

// Schema for creating a category
export const CategoryCreateSchema = z
	.object({
		body: z.object({
			name: z
				.string()
				.min(3, "Name is required")
				.openapi({ example: "Technology" }),
			description: z
				.string()
				.optional()
				.openapi({ example: "Category for technology-related ideas" }),
		}),
	})
	.openapi("CategoryCreate");

// Schema for updating a category
export const CategoryUpdateSchema = z
	.object({
		body: z.object({
			name: z.string().min(3, "Name is required").optional(),
			description: z.string().optional(),
		}),
	})
	.openapi("CategoryUpdate");

// Export types
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;
export type Category = z.infer<typeof CategorySchema>;
