import { Router } from "express";
import { getIdeas } from "../../../handlers/ideaHandlers";
import { registry } from "../../../config/swagger";
import { GlobalErrorSchema, PaginationSchema } from "../../../schemas";
import { GetIdeasResponse } from "../../../schemas/Idea.schema";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/ideas",
	summary: "Retrieve ideas with pagination",
	description:
		"Retrieve ideas with pagination, excluding those pending approval",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		query: PaginationSchema.shape.query,
	},
	responses: {
		200: {
			description: "A list of ideas with pagination information",
			content: {
				"application/json": {
					schema: GetIdeasResponse,
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
		403: {
			description: "Forbidden",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
	},
});

router.get("/", getIdeas);

export default router;
