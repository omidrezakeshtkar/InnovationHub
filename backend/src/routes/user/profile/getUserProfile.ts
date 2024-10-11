import { Router } from "express";
import { getUserProfile } from "../../../handlers/userHandlers";
import { auth } from "../../../middleware/auth";
import { registry } from "../../../config/swagger";
import { GlobalErrorSchema } from "../../../schemas";
import { UserSchema } from "../../../schemas/User.schema";

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
	},
});

router.get("/", auth, getUserProfile);

export default router;
