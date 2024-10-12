import { Router } from "express";
import { getDepartmentById } from "../../handlers/departmentHandlers";
import { auth } from "../../middleware/auth";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import {
	DepartmentSchema,
	DepartmentIdSchema,
} from "../../schemas/Department.schema";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/departments/{id}",
	summary: "Retrieve a department by its ID",
	tags: ["Departments"],
	security: [{ bearerAuth: [] }],
	request: {
		params: DepartmentIdSchema.shape.params,
	},
	responses: {
		200: {
			description: "The department with the specified ID",
			content: {
				"application/json": {
					schema: DepartmentSchema,
				},
			},
		},
		404: {
			description: "Department not found",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
	},
});

router.get(
	"/:id",
	auth,
	validateRequest(DepartmentIdSchema),
	getDepartmentById
);

export default router;
