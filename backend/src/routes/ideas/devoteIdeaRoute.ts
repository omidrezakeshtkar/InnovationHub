import { Router } from "express";
import { devoteIdea } from "../../handlers/ideaHandlers";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { VoteSchema, ErrorSchema } from "../../schemas/Idea.schema";
import { registry } from "../../config/swagger";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/ideas/{id}/devote",
	summary: "Remove vote from an idea",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			id: z
				.string()
				.openapi({ description: "The ID of the idea to remove vote from" }),
		}),
		body: {
			content: {
				"application/json": {
					schema: VoteSchema.shape.body,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Vote successfully removed",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string().openapi({ description: "Success message" }),
					}),
				},
			},
		},
		400: {
			description: "Bad request",
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
		},
	},
});

router.post("/:id/devote", auth, validateRequest(VoteSchema), devoteIdea);

export default router;
