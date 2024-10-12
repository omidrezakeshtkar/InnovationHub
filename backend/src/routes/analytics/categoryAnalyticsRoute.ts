import { Router } from "express";
import { getCategoryAnalytics } from "../../handlers/analyticsHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/analytics/category",
	summary: "Get category analytics",
	tags: ["Analytics"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Category analytics data",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							categoryStats: { type: "array" },
						},
					},
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

router.get(
	"/category",
	auth,
	authorize(PERMISSIONS.VIEW_ANALYTICS),
	getCategoryAnalytics
);

export default router;
