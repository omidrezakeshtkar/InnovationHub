import { Router } from "express";
import { getIdeaComments } from "../../../handlers/ideaHandlers";
import { registry } from "../../../config/swagger";
import { GlobalErrorSchema, PaginationSchema } from "../../../schemas";
import { CommentSchema } from "../../../schemas/Comment.schema";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/ideas/{_id}/comments",
	description: "Retrieve comments for a specific idea with pagination",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			_id: z.string().describe("The ID of the idea"),
		}),
		query: PaginationSchema.shape.query,
	},
	responses: {
		200: {
			description: "A list of comments for the specified idea",
			content: {
				"application/json": {
					schema: z.object({
						comments: z.array(CommentSchema),
						totalComments: z.number(),
						offset: z.number(),
						limit: z.number(),
						hasMore: z.boolean(),
					}),
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

router.get("/:_id/comments", getIdeaComments);

export default router;
