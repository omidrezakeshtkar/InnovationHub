import { Router } from "express";
import { getIdeasByUser } from "../../handlers/ideaHandlers";
import { auth } from "../../middleware/auth";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { GetIdeasResponse } from "../../schemas/Idea.schema";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/ideas/user",
	summary: "Retrieve ideas for the authenticated user",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "A list of ideas for the authenticated user",
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
	},
});

router.get("/user", auth, getIdeasByUser);

export default router;
