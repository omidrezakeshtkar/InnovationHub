import { Schema, model, Document } from "mongoose";

interface IError extends Document {
	message: string;
	createdAt: Date;
	updatedAt: Date;
}

const errorSchema = new Schema(
	{
		message: { type: String, required: true },
	},
	{ timestamps: true }
);

export default model<IError>("Error", errorSchema);
