import { Router } from "express";
import { getUsersWithUnassignedDepartment } from "../../handlers/userHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { z } from "zod";
import { UserSchema } from "../../schemas/User.schema";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/departments/unassigned-users",
	summary: "Retrieve users without assigned departments",
	tags: ["Departments"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "A list of users without assigned departments",
			content: {
				"application/json": {
					schema: z.array(UserSchema),
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
	"/unassigned-users",
	auth,
	authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
	getUsersWithUnassignedDepartment
);

export default router;
