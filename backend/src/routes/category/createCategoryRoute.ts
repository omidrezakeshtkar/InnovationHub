import { Router } from "express";
import { createCategory } from "../../handlers/categoryHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { validateRequest } from "../../middleware/validateRequest";
import { GlobalErrorSchema } from "../../schemas";
import {
	CategoryCreateSchema,
	CategorySchema,
} from "../../schemas/Category.schema";
import { registry } from "../../config/swagger";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/categories",
	summary: "Create a new category",
	tags: ["Categories"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: CategoryCreateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Category created successfully",
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
	},
});

router.post(
	"/",
	auth,
	authorize(PERMISSIONS.CREATE_CATEGORY),
	validateRequest(CategoryCreateSchema),
	createCategory
);

export default router;
