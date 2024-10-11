import { Router } from "express";
import { getCategoryByIdOrTitle } from "../../handlers/categoryHandlers";
import { auth } from "../../middleware/auth";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { CategorySchema } from "../../schemas/Category.schema";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/categories/{identifier}",
	summary: "Retrieve a category by its ID or title",
	tags: ["Categories"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			identifier: z.string().openapi({
				description: "The ID or title of the category to retrieve",
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

router.get("/:identifier", auth, getCategoryByIdOrTitle);

export default router;
