import { Router } from "express";
import { getIdeaVersions } from "../../../handlers/ideaHandlers";
import { auth } from "../../../middleware/auth";
import { registry } from "../../../config/swagger";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { GlobalErrorSchema } from "../../../schemas";
import { IdeaVersionSchema } from "../../../schemas/IdeaVersion.schema";

extendZodWithOpenApi(z);

const router = Router();

const IdeaIdSchema = z.string().openapi({
	param: {
		name: "id",
		in: "path",
	},
	description: "The ID of the idea to retrieve its versions",
	example: "123456",
});

registry.registerPath({
	method: "get",
	path: "/ideas/{id}/versions",
	description: "Retrieve all versions of an idea",
	summary: "Retrieve all versions of an idea",
	tags: ["Ideas"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ id: IdeaIdSchema }),
	},
	responses: {
		200: {
			description: "A list of idea versions",
			content: {
				"application/json": {
					schema: z.array(IdeaVersionSchema),
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

router.get("/:id/versions", auth, getIdeaVersions);

export default router;
