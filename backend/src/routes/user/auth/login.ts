import { Router } from "express";
import { login } from "../../../handlers/authHandlers";
import { validateRequest } from "../../../middleware/validateRequest";
import { authLimiter } from "../../../middleware/rateLimiter";
import {
	LoginRequestSchema,
	LoginResponseSchema,
} from "../../../schemas/User.schema";
import { registry } from "../../../config/swagger";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/user/auth/login",
	summary: "User login",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: LoginRequestSchema.shape.body,
				},
			},
		},
	},
	responses: {
		200: {
			description: "User logged in successfully",
			content: {
				"application/json": {
					schema: LoginResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request data",
		},
		401: {
			description: "Invalid credentials",
		},
	},
});

router.post(
	"/",
	authLimiter,
	validateRequest(LoginRequestSchema),
	async (req, res, next) => {
		try {
			await login(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
