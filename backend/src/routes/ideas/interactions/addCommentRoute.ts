import { Router } from "express";
import { addComment } from "../../../handlers/ideaHandlers";
import { auth } from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validateRequest";
import { GlobalErrorSchema } from "../../../schemas";
import {
	CommentCreateSchema,
	CommentSchema,
} from "../../../schemas/Comment.schema";
import { registry } from "../../../config/swagger";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/ideas/{_id}/comments",
	summary: "Add a comment to an idea",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			_id: z
				.string()
				.openapi({ description: "The ID of the idea to comment on" }),
		}),
		body: {
			content: {
				"application/json": {
					schema: CommentCreateSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Comment added successfully",
			content: {
				"application/json": {
					schema: CommentSchema,
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
	"/:_id/comments",
	auth,
	validateRequest(CommentCreateSchema),
	addComment
);

export default router;
