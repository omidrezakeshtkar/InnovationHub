import { ObjectId } from "mongodb";
import { Schema, model, Document } from "mongoose";

interface IIdeaVersion extends Document {
	idea: ObjectId;
	title: string;
	description: string;
	updatedBy: ObjectId;
	versionNumber: number;
	createdAt: Date;
}

const ideaVersionSchema = new Schema(
	{
		idea: { type: ObjectId, ref: "Idea", required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		updatedBy: { type: ObjectId, ref: "User", required: true },
		versionNumber: { type: Number, required: true },
	},
	{ timestamps: true }
);

export default model<IIdeaVersion>("IdeaVersion", ideaVersionSchema);
