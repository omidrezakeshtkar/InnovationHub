import { Router } from "express";
import { createDepartment } from "../../handlers/departmentHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { validateRequest } from "../../middleware/validateRequest";
import { GlobalErrorSchema } from "../../schemas";
import {
	DepartmentCreateSchema,
	DepartmentSchema,
} from "../../schemas/Department.schema";
import { registry } from "../../config/swagger";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/departments",
	summary: "Create a new department",
	tags: ["Departments"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: DepartmentCreateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Department created successfully",
			content: {
				"application/json": {
					schema: DepartmentSchema,
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
	"/",
	auth,
	authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
	validateRequest(DepartmentCreateSchema),
	createDepartment
);

export default router;
