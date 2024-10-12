import { Router } from "express";
import { getIdeaTrendsAnalytics } from "../../handlers/analyticsHandlers";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { PERMISSIONS } from "../../config/permissions";
import { registry } from "../../config/swagger";
import { GlobalErrorSchema } from "../../schemas";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/analytics/idea-trends",
	summary: "Get idea trends analytics",
	tags: ["Analytics"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Idea trends analytics data",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							trendingIdeas: { type: "array" },
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

router.get("/idea-trends", getIdeaTrendsAnalytics);

export default router;
