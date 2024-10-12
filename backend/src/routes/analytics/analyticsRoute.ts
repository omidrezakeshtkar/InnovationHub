import { Router } from "express";
import { getAnalytics } from "../../handlers/analyticsHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/analytics",
	summary: "Get analytics data",
	tags: ["Analytics"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Analytics data",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							overallStats: { type: "object" },
							topCategories: { type: "array" },
							userEngagement: { type: "object" },
							ideaTrends: { type: "array" },
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

router.get("/", auth, authorize(PERMISSIONS.VIEW_ANALYTICS), getAnalytics);

export default router;
