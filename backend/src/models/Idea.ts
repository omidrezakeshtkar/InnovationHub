import { ObjectId } from "mongodb";
import { Schema, model, Document } from "mongoose";

interface IIdea extends Document {
	title: string;
	description: string;
	author: ObjectId;
	coAuthors: ObjectId[];
	status: string;
	category: ObjectId;
	department: string;
	votes: number;
	devotes: number;
	netVotes: number;
	userVotes: { userId: ObjectId; vote: string }[];
	tags: string[];
	currentVersion: number;
	createdAt: Date;
	updatedAt: Date;
}

const ideaSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		author: { type: ObjectId, ref: "User", required: true },
		coAuthors: [{ type: ObjectId, ref: "User" }],
		status: {
			type: String,
			enum: [
				"pending_approval",
				"draft",
				"submitted",
				"in_review",
				"approved",
				"implemented",
				"rejected",
			],
			default: "draft",
		},
		category: { type: ObjectId, ref: "Category", required: true },
		department: { type: String, required: true },
		votes: { type: Number, default: 0 },
		devotes: { type: Number, default: 0 },
		netVotes: { type: Number, default: 0 },
		userVotes: [
			{
				userId: { type: ObjectId, ref: "User" },
				vote: { type: String, enum: ["up", "down"] },
			},
		],
		tags: [{ type: String }],
		currentVersion: { type: Number, default: 1 },
	},
	{ timestamps: true }
);

export default model<IIdea>("Idea", ideaSchema);
