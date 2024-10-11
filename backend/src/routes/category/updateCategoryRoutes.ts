import { Router } from "express";
import { updateCategory } from "../../handlers/categoryHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { validateRequest } from "../../middleware/validateRequest";
import { GlobalErrorSchema } from "../../schemas";
import {
	CategoryUpdateSchema,
	CategorySchema,
} from "../../schemas/Category.schema";
import { registry } from "../../config/swagger";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "put",
	path: "/categories/{id}",
	summary: "Update a category by its ID",
	tags: ["Categories"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			id: z
				.string()
				.openapi({ description: "The ID of the category to update" }),
		}),
		body: {
			content: {
				"application/json": {
					schema: CategoryUpdateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		200: {
			description: "The category with the specified ID has been updated",
			content: {
				"application/json": {
					schema: CategorySchema,
				},
			},
		},
		400: {
			description: "Bad request",
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

router.put(
	"/:id",
	auth,
	authorize(PERMISSIONS.MANAGE_CATEGORIES),
	validateRequest(CategoryUpdateSchema),
	updateCategory
);

export default router;
