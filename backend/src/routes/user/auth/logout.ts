import { Router } from "express";
import { logout } from "../../../handlers/authHandlers";
import { auth } from "../../../middleware/auth";
import { registry } from "../../../config/swagger";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/user/auth/logout",
	summary: "User logout",
	tags: ["Auth"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "User logged out successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: { type: "string" },
						},
					},
				},
			},
		},
	},
});

router.post("/", auth, async (req, res, next) => {
	try {
		await logout(req, res, next);
	} catch (error) {
		next(error);
	}
});

export default router;
