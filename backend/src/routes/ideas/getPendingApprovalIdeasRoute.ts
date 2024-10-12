import { Router } from "express";
import { getPendingApprovalIdeas } from "../../handlers/ideaHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { GetIdeasResponse } from "../../schemas/Idea.schema";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/ideas/pending",
	description: "Retrieve all pending approval ideas",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "A list of pending approval ideas",
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
	},
});

router.get(
	"/pending",
	auth,
	authorize(PERMISSIONS.APPROVE_IDEA),
	getPendingApprovalIdeas
);

export default router;
