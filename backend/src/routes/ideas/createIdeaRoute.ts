import { Router } from "express";
import { createIdea } from "../../handlers/ideaHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { validateRequest } from "../../middleware/validateRequest";
import { GlobalErrorSchema } from "../../schemas";
import { IdeaCreateSchema, IdeaSchema } from "../../schemas/Idea.schema";
import { registry } from "../../config/swagger";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/ideas",
	summary: "Create a new idea",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: IdeaCreateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Idea created successfully",
			content: {
				"application/json": {
					schema: IdeaSchema,
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
	authorize(PERMISSIONS.CREATE_IDEA),
	validateRequest(IdeaCreateSchema),
	createIdea
);

export default router;
