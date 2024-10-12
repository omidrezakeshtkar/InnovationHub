import { Router } from "express";
import { deleteCategory } from "../../handlers/categoryHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { z } from "zod";
import { GlobalErrorSchema } from "../../schemas";

const router = Router();

registry.registerPath({
	method: "delete",
	path: "/categories/{id}",
	summary: "Delete a category by its ID",
	tags: ["Categories"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			id: z
				.string()
				.openapi({ description: "The ID of the category to delete" }),
		}),
	},
	responses: {
		200: {
			description: "Category deleted successfully",
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

router.delete(
	"/:id",
	auth,
	authorize(PERMISSIONS.DELETE_CATEGORY),
	deleteCategory
);

export default router;
