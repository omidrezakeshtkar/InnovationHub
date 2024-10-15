import { Router } from "express";
import { updateIdea } from "../../../handlers/ideaHandlers";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authorize";
import { PERMISSIONS } from "../../../config/permissions";
import { validateRequest } from "../../../middleware/validateRequest";
import { GlobalErrorSchema } from "../../../schemas";
import { IdeaUpdateSchema, IdeaSchema } from "../../../schemas/Idea.schema";
import { registry } from "../../../config/swagger";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "put",
	path: "/ideas/{id}",
	summary: "Update an idea by its ID",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			id: z.string().openapi({ description: "The ID of the idea to update" }),
		}),
		body: {
			content: {
				"application/json": {
					schema: IdeaUpdateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		200: {
			description: "The idea with the specified ID has been updated",
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
		404: {
			description: "Idea not found",
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
	authorize(PERMISSIONS.EDIT_IDEA),
	validateRequest(IdeaUpdateSchema),
	updateIdea
);

export default router;
