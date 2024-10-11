import { Router } from "express";
import { getDepartments } from "../../handlers/departmentHandlers";
import { auth } from "../../middleware/auth";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { DepartmentSchema } from "../../schemas/Department.schema";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/departments",
	summary: "Retrieve all departments",
	tags: ["Departments"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "A list of departments",
			content: {
				"application/json": {
					schema: z.array(DepartmentSchema),
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

router.get("/", auth, getDepartments);

export default router;
