import { Router } from "express";
import { register } from "../../../handlers/authHandlers";
import { authLimiter } from "../../../middleware/rateLimiter";
import { validateRequest } from "../../../middleware/validateRequest";
import {
	UserCreateSchema,
	RegisterResponseSchema,
} from "../../../schemas/User.schema";
import { registry } from "../../../config/swagger";

const router = Router();

registry.registerPath({
	method: "post",
	path: "/user/auth/register",
	summary: "Register a new user",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: UserCreateSchema.shape.body,
				},
			},
		},
	},
	responses: {
		201: {
			description: "User registered successfully",
			content: {
				"application/json": {
					schema: RegisterResponseSchema,
				},
			},
		},
		400: {
			description: "Bad request",
		},
		429: {
			description: "Too many requests",
		},
	},
});

router.post(
	"/",
	authLimiter,
	validateRequest(UserCreateSchema),
	async (req, res, next) => {
		try {
			await register(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
