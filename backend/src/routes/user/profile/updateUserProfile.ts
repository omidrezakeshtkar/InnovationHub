import { Router } from "express";
import { updateUserProfile } from "../../../handlers/userHandlers";
import { auth } from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validateRequest";
import { registry } from "../../../config/swagger";
import { GlobalErrorSchema } from "../../../schemas";
import { UserUpdateSchema, UserSchema } from "../../../schemas/User.schema";

const router = Router();

registry.registerPath({
	method: "put",
	path: "/user/profile",
	summary: "Update the authenticated user's profile",
	tags: ["User Profile"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: UserUpdateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		200: {
			description: "User profile updated successfully",
			content: {
				"application/json": {
					schema: UserSchema,
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
			description: "User not found",
			content: {
				"application/json": {
					schema: GlobalErrorSchema,
				},
			},
		},
	},
});

router.put("/", auth, validateRequest(UserUpdateSchema), updateUserProfile);

export default router;
