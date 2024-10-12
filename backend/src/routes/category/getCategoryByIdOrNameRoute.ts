import { Router } from "express";
import { getCategoryByIdOrName } from "../../handlers/categoryHandlers";
import { auth } from "../../middleware/auth";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { CategorySchema } from "../../schemas/Category.schema";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/categories/search",
	summary: "Retrieve a category by its ID or title",
	tags: ["Categories"],
	security: [{ bearerAuth: [] }],
	request: {
		query: z.object({
			id: z.string().optional().openapi({
				description: "The ID of the category to retrieve",
			}),
			name: z.string().optional().openapi({
				description: "The name of the category to retrieve",
			}),
		}),
	},
	responses: {
		200: {
			description: "The category with the specified ID or title",
			content: {
				"application/json": {
					schema: CategorySchema,
				},
			},
		},
		400: {
			description: "Invalid request parameters",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
		404: {
			description: "Category not found",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
	},
});

router.get("/search", getCategoryByIdOrName);

export default router;
