import { Router } from "express";
import { getUserEngagementAnalytics } from "../../handlers/analyticsHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/analytics/user-engagement",
	summary: "Get user engagement analytics",
	tags: ["Analytics"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "User engagement analytics data",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							activeUsers: { type: "number" },
							engagementRate: { type: "number" },
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
	"/user-engagement",
	auth,
	authorize(PERMISSIONS.VIEW_ANALYTICS),
	getUserEngagementAnalytics
);

export default router;
