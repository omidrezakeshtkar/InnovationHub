import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { objectIdSchema } from "./index";

extendZodWithOpenApi(z);

// Schema for a single department
export const DepartmentSchema = z
	.object({
		id: objectIdSchema.openapi({ example: "60d5ec49f1b2c72b9c8e4d3b" }),
		name: z
			.string()
			.min(3, "Name is required")
			.openapi({ example: "Engineering" }),
		description: z
			.string()
			.optional()
			.openapi({ example: "Department responsible for engineering tasks" }),
		createdAt: z.date().openapi({ example: "2023-01-01T00:00:00Z" }),
		updatedAt: z.date().openapi({ example: "2023-01-02T00:00:00Z" }),
	})
	.openapi("Department");

// Schema for pagination parameters
export const PaginationSchema = z.object({
	query: z.object({
		limit: z.number().int().positive().optional().openapi({
			description: "Number of items to return",
			example: 10,
		}),
		offset: z.number().int().nonnegative().optional().openapi({
			description: "Number of items to skip",
			example: 0,
		}),
	}),
});

// Schema for creating a department
export const DepartmentCreateSchema = z
	.object({
		body: z.object({
			name: z
				.string()
				.min(3, "Name is required")
				.openapi({ example: "Engineering" }),
			description: z
				.string()
				.optional()
				.openapi({ example: "Department responsible for engineering tasks" }),
		}),
	})
	.openapi("DepartmentCreate");

// Schema for updating a department
export const DepartmentUpdateSchema = z
	.object({
		body: z.object({
			name: z.string().min(3, "Name is required").optional(),
			description: z.string().optional(),
		}),
	})
	.openapi("DepartmentUpdate");

// Schema for department ID parameter
export const DepartmentIdSchema = z
	.object({
		params: z.object({
			id: z.string().openapi({ description: "The ID of the department" }),
		}),
	})
	.openapi("DepartmentId");

// Export types
export type DepartmentCreate = z.infer<typeof DepartmentCreateSchema>;
export type DepartmentUpdate = z.infer<typeof DepartmentUpdateSchema>;
export type Department = z.infer<typeof DepartmentSchema>;
export type DepartmentId = z.infer<typeof DepartmentIdSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
