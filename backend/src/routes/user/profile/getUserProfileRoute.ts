import { Router } from "express";
import { getUserProfile } from "../../../handlers/userHandlers";
import { auth } from "../../../middleware/auth";
import { registry } from "../../../config/swagger";
import { GlobalErrorSchema } from "../../../schemas";
import { GetUserSchema, UserSchema } from "../../../schemas/User.schema";
import { validateRequest } from "../../../middleware/validateRequest";

const router = Router();

registry.registerPath({
	method: "get",
	path: "/user/profile",
	summary: "Retrieve the authenticated user's profile",
	tags: ["User Profile"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "User profile retrieved successfully",
			content: {
				"application/json": {
					schema: UserSchema,
				},
			},
		},
		404: {
			description: "User not found",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
	},
});

router.get(
	"/",
	auth,
	validateRequest(GetUserSchema),
	async (req, res, next) => {
		try {
			await getUserProfile(req, res, next);
		} catch (error) {
			console.error("Error in getUserProfile route:", error);
			next(error);
		}
	}
);

export default router;
