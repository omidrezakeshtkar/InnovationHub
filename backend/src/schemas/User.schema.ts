import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { objectIdSchema } from "./index";

extendZodWithOpenApi(z);

export const UserSchema = z
	.object({
		_id: objectIdSchema.openapi({ example: "60d5ec49f1b2c72b9c8e4d3b" }),
		name: z.string().openapi({ example: "John Doe" }),
		email: z.string().email().openapi({ example: "john@example.com" }),
		password: z.string().min(3, "Password must be at least 6 characters long"),
		role: z.enum(["user", "moderator", "admin", "department_head", "owner"]),
		department: z.string().openapi({ example: "Engineering" }),
		permissions: z
			.array(z.string())
			.openapi({ example: ["create:idea", "edit:idea"] }),
		points: z.number().openapi({ example: 100 }),
		badges: z
			.array(z.string())
			.openapi({ example: ["badge-123", "badge-456"] }),
		isDeleted: z.boolean().openapi({ example: false }),
		deletedAt: z.date().optional(),
		originalEmail: z.string().email().optional(),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
	.openapi("User");

// Schema for creating a user
export const UserCreateSchema = z
	.object({
		body: UserSchema.omit({
			_id: true,
			permissions: true,
			points: true,
			badges: true,
			isDeleted: true,
			deletedAt: true,
			originalEmail: true,
			createdAt: true,
			updatedAt: true,
		}),
	})
	.openapi("UserCreate");

// Schema for updating a user
export const UserUpdateSchema = z
	.object({
		body: UserSchema.partial().omit({
			_id: true,
			password: true,
			permissions: true,
			points: true,
			badges: true,
			isDeleted: true,
			deletedAt: true,
			originalEmail: true,
			createdAt: true,
			updatedAt: true,
		}),
	})
	.openapi("UserUpdate");

// Schema for token
export const TokenSchema = z
	.object({
		access_token: z.string(),
		token_type: z.string(),
		payload: UserSchema.pick({
			_id: true,
			email: true,
			role: true,
			department: true,
		}).extend({
			isAdmin: z.boolean(),
			isOwner: z.boolean(),
			isLoggedIn: z.boolean(),
			iat: z.number(),
			exp: z.number(),
		}),
	})
	.openapi("Token");

// Schema for deleting a user
export const UserDeleteSchema = z
	.object({
		params: z.object({
			id: UserSchema.shape._id.optional(),
		}),
	})
	.openapi("UserDelete");

// Schema for refresh token request
export const RefreshTokenRequestSchema = z
	.object({
		body: z.object({
			refreshToken: z.string().nonempty("Refresh token is required"),
		}),
	})
	.openapi("RefreshTokenRequest");

// Schema for refresh token response
export const RefreshTokenResponseSchema = z
	.object({
		accessToken: z.string(),
		refreshToken: z.string(),
	})
	.openapi("RefreshTokenResponse");

// Schema for login request
export const LoginRequestSchema = z
	.object({
		body: UserSchema.pick({
			email: true,
			password: true,
		}).extend({
			rememberMe: z.boolean().optional(),
		}),
	})
	.openapi("LoginRequest");

// Schema for login response
export const LoginResponseSchema = z
	.object({
		accessToken: z.string(),
		refreshToken: z.string(),
		clientId: z.string(),
	})
	.openapi("LoginResponse");

// Schema for register response
export const RegisterResponseSchema =
	LoginResponseSchema.openapi("RegisterResponse");

export const GetUserSchema = z
	.object({
		id: UserSchema.shape._id.optional().openapi({ example: "user-123" }),
	})
	.openapi("User");

// Export types
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type User = z.infer<typeof UserSchema>;
export type GetUser = z.infer<typeof GetUserSchema>;
export type Token = z.infer<typeof TokenSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
