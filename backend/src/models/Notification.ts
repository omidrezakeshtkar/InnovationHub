import { ObjectId } from "mongodb";
import { Schema, model, Document } from "mongoose";

interface INotification extends Document {
	recipient: ObjectId;
	content: string;
	type: string;
	relatedIdea?: ObjectId;
	read: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const notificationSchema = new Schema(
	{
		recipient: { type: ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		type: {
			type: String,
			enum: ["idea_approved", "new_comment", "idea_status_change"],
			required: true,
		},
		relatedIdea: { type: ObjectId, ref: "Idea" },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default model<INotification>("Notification", notificationSchema);
