import { Router } from "express";
import { deleteDepartment } from "../../handlers/departmentHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";
import { DepartmentIdSchema } from "../../schemas/Department.schema";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

registry.registerPath({
	method: "delete",
	path: "/departments/{id}",
	summary: "Delete a department by its ID",
	tags: ["Departments"],
	security: [{ bearerAuth: [] }],
	request: {
		params: DepartmentIdSchema.shape.params,
	},
	responses: {
		200: {
			description: "Department deleted successfully",
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

router.delete(
	"/:id",
	auth,
	authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
	validateRequest(DepartmentIdSchema),
	deleteDepartment
);

export default router;
