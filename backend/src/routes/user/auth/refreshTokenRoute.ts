import { Router } from "express";
import {
	refreshToken,
	refreshTokenLimiter,
} from "../../../handlers/authHandlers";
import { validateRequest } from "../../../middleware/validateRequest";
import {
	RefreshTokenRequestSchema,
	RefreshTokenResponseSchema,
} from "../../../schemas/User.schema";
import { registry } from "../../../config/swagger";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/user/auth/refresh-token",
	summary: "Refresh user token",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: RefreshTokenRequestSchema.shape.body,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Tokens refreshed successfully",
			content: {
				"application/json": {
					schema: RefreshTokenResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request data",
		},
		401: {
			description: "Invalid or expired refresh token",
		},
		404: {
			description: "User not found",
		},
		429: {
			description: "Too many requests, try again later",
		},
	},
});

router.post(
	"/",
	refreshTokenLimiter,
	validateRequest(RefreshTokenRequestSchema),
	async (req, res, next) => {
		try {
			await refreshToken(req, res, next);
		} catch (error) {
			console.error("Error in refreshToken route:", error);
			next(error);
		}
	}
);

export default router;
