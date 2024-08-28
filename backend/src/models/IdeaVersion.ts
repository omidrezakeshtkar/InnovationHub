import { Schema, model, Document } from 'mongoose';

interface IIdeaVersion extends Document {
  idea: Schema.Types.ObjectId;
  title: string;
  description: string;
  updatedBy: Schema.Types.ObjectId;
  versionNumber: number;
  createdAt: Date;
}

const ideaVersionSchema = new Schema({
  idea: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  versionNumber: { type: Number, required: true },
}, { timestamps: true });

export default model<IIdeaVersion>('IdeaVersion', ideaVersionSchema);