import { z } from "zod";
import mongoose from "mongoose";

// Custom Zod validation for ObjectId
const objectIdSchema = z
	.string()
	.refine((value) => mongoose.Types.ObjectId.isValid(value), {
		message: "Invalid ObjectId",
	});

// Import and export other schemas
import {
	UserCreateSchema,
	UserUpdateSchema,
	UserSchema,
	TokenSchema,
	UserDeleteSchema,
	RefreshTokenRequestSchema,
	RefreshTokenResponseSchema,
	LoginRequestSchema,
	LoginResponseSchema,
	RegisterResponseSchema,
} from "./User.schema";
import { BadgeSchema, BadgeCreateSchema } from "./Badge.schema";
import { CategorySchema, CategoryCreateSchema } from "./Category.schema";
import {
	CommentSchema as CommentSchemaFromComment,
	CommentCreateSchema as CommentCreateSchemaFromComment,
} from "./Comment.schema";
import {
	IdeaSchema,
	IdeaCreateSchema,
	IdeaUpdateSchema,
	VoteSchema,
	ErrorSchema as IdeaErrorSchema,
} from "./Idea.schema";
import {
	IdeaVersionSchema,
	IdeaVersionCreateSchema,
} from "./IdeaVersion.schema";
import {
	NotificationSchema,
	NotificationCreateSchema,
} from "./Notification.schema";

// Define a global error schema
const GlobalErrorSchema = z
	.object({
		message: z.string().openapi({ example: "An error occurred" }),
		code: z.number().optional().openapi({ example: 400 }),
		details: z
			.string()
			.optional()
			.openapi({ example: "Detailed error message" }),
	})
	.openapi("GlobalError");

// Schema for pagination parameters
export const PaginationSchema = z.object({
	query: z.object({
		limit: z.number().int().positive().optional().openapi({
			description: "Number of items to return",
			example: 10,
		}),
		offset: z.number().int().nonnegative().optional().openapi({
			description: "Number of items to skip",
			example: 0,
		}),
	}),
});

export {
	UserCreateSchema,
	UserUpdateSchema,
	UserSchema,
	TokenSchema,
	UserDeleteSchema,
	RefreshTokenRequestSchema,
	RefreshTokenResponseSchema,
	LoginRequestSchema,
	LoginResponseSchema,
	RegisterResponseSchema,
	BadgeSchema,
	BadgeCreateSchema,
	CategorySchema,
	CategoryCreateSchema,
	CommentSchemaFromComment as CommentSchema,
	CommentCreateSchemaFromComment,
	IdeaSchema,
	IdeaCreateSchema,
	IdeaUpdateSchema,
	VoteSchema,
	IdeaVersionSchema,
	IdeaVersionCreateSchema,
	NotificationSchema,
	NotificationCreateSchema,
	GlobalErrorSchema, // Ensure this is only exported once
	objectIdSchema, // Export the objectIdSchema
};
