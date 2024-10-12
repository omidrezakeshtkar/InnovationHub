import { Router } from "express";
import { getIdeaByIdOrTitle } from "../../handlers/ideaHandlers";
import { auth } from "../../middleware/auth";
import { z } from "zod";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { IdeaSchema } from "../../schemas/Idea.schema";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/ideas/search",
	summary: "Retrieve an idea by its ID or title",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		query: z.object({
			id: z.string().optional().describe("The ID of the idea to retrieve"),
			title: z
				.string()
				.optional()
				.describe("The title of the idea to retrieve"),
		}),
	},
	responses: {
		200: {
			description: "The idea with the specified ID or title",
			content: {
				"application/json": {
					schema: IdeaSchema,
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

router.get("/search", auth, getIdeaByIdOrTitle);

export default router;
