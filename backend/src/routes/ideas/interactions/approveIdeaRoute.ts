import { Router } from "express";
import { approveIdea } from "../../../handlers/ideaHandlers";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authorize";
import { PERMISSIONS } from "../../../config/permissions";
import { validateRequest } from "../../../middleware/validateRequest";
import { registry } from "../../../config/swagger";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/ideas/{id}/approve",
	summary: "Approve an idea",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			id: z.string().openapi({ description: "The ID of the idea to approve" }),
		}),
	},
	responses: {
		200: {
			description: "Idea approved successfully",
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
		},
		403: {
			description: "Forbidden",
		},
	},
});

router.post(
	"/:id/approve",
	auth,
	authorize(PERMISSIONS.APPROVE_IDEA),
	approveIdea
);

export default router;
