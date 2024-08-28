import { Schema, model, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *         - department
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, moderator, admin, department_head]
 *         department:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *         points:
 *           type: number
 *         badges:
 *           type: array
 *           items:
 *             type: string
 */
export interface IUser extends Document {
	id: string;
	name: string;
	email: string;
	password: string;
	role: "user" | "moderator" | "admin" | "department_head";
	department: string;
	permissions: string[];
	points: number;
	badges: Schema.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["user", "moderator", "admin", "department_head"],
			default: "user",
		},
		department: { type: String, required: true },
		permissions: [{ type: String }],
		points: { type: Number, default: 0 },
		badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
	},
	{ timestamps: true }
);

export default model<IUser>("User", userSchema);
