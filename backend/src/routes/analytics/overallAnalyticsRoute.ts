import { Router } from "express";
import { getOverallAnalytics } from "../../handlers/analyticsHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/analytics/overall",
	summary: "Get overall analytics",
	tags: ["Analytics"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Overall analytics data",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							totalIdeas: { type: "number" },
							totalUsers: { type: "number" },
							totalVotes: { type: "number" },
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
	"/overall",
	auth,
	authorize(PERMISSIONS.VIEW_ANALYTICS),
	getOverallAnalytics
);

export default router;
