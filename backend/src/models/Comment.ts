import { ObjectId } from "mongodb";
import { Schema, model, Document } from "mongoose";

interface IComment extends Document {
	content: string;
	author: ObjectId;
	idea: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const commentSchema = new Schema(
	{
		content: { type: String, required: true },
		author: { type: ObjectId, ref: "User", required: true },
		idea: { type: ObjectId, ref: "Idea", required: true },
	},
	{ timestamps: true }
);

export default model<IComment>("Comment", commentSchema);
