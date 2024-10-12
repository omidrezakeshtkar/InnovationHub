import { Router } from "express";
import { updateDepartment } from "../../handlers/departmentHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { validateRequest } from "../../middleware/validateRequest";
import { GlobalErrorSchema } from "../../schemas";
import {
	DepartmentUpdateSchema,
	DepartmentSchema,
} from "../../schemas/Department.schema";
import { registry } from "../../config/swagger";
import { z } from "zod";

const router = Router();

registry.registerPath({
	method: "put",
	path: "/departments/{id}",
	summary: "Update a department by its ID",
	tags: ["Departments"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({
			id: z
				.string()
				.openapi({ description: "The ID of the department to update" }),
		}),
		body: {
			content: {
				"application/json": {
					schema: DepartmentUpdateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		200: {
			description: "The department with the specified ID has been updated",
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

router.put(
	"/:id",
	auth,
	authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
	validateRequest(DepartmentUpdateSchema),
	updateDepartment
);

export default router;

// You can generate the OpenAPI document like this:
// const generator = new OpenApiGeneratorV3(registry.definitions);
// const openApiDocument = generator.generateDocument({
//   openapi: '3.0.0',
//   info: {
//     version: '1.0.0',
//     title: 'Your API',
//     description: 'Your API description',
//   },
//   servers: [{ url: 'v1' }],
// });
